import { supabase } from "@shared/context/AuthProvider";
import { Company } from "@shared/types/global/company";
import { ConnectionResponse } from "@shared/types/response";

export const CHUNK_SIZE = 4500; // 4500 is safe since supabase limit is 5000 rows per query
export const MAX_IN_UUIDS = 100; // Using more than 100 UUIDs in a query may result in a URI too long error

export interface SupabaseModifier {
  modifier: "eq" | "gt" | "lt" | "in"; // add more modifiers as needed
  key: string;
  value: string | string[];
}

// Refreshes data from a supabase table that may have more than 5000 rows.
export const fetchLargeTable = async <T>(
  tableName: string,
  selectString: string,
  modifiers: SupabaseModifier[],
  allowRetries: boolean = true,
): Promise<ConnectionResponse<T[]>> => {
  // Get count
  let query = supabase.from(tableName).select(selectString, { count: "exact", head: true });
  for (const modifier of modifiers) {
    switch (modifier.modifier) {
      case "eq":
        query = query.eq(modifier.key, modifier.value);
        break;
      case "gt":
        query = query.gt(modifier.key, modifier.value);
        break;
      case "lt":
        query = query.lt(modifier.key, modifier.value);
        break;
      case "in":
        if (!Array.isArray(modifier.value)) {
          throw new Error("Value for 'in' modifier must be an array");
        }
        if (modifier.value.length > 100) {
          console.error("'in' modifier value has more than 100 items. High risk of '429 URI too long' issues.");
        }
        query = query.in(modifier.key, modifier.value);
        break;
    }
  }
  const { count: totalCount, error: countError } = await query;
  if (countError || totalCount === null) {
    if (countError) console.error(countError);
    return { data: [], error: countError?.message || "Error fetching data" };
  }

  const allData: any[] = [];

  // Get the data in chunks of CHUNK_SIZE. Query limit is 5000 rows per query so use CHUNK_SIZE=4500 to be safe.
  // This could lead to some data being missed if the table is updated while the data is being fetched.
  // It could also lead to duplicate data if the table is updated while the data is being fetched.
  for (let offset = 0; offset < totalCount; offset += CHUNK_SIZE) {
    let dataQuery = supabase.from(tableName).select(selectString);
    for (const modifier of modifiers) {
      switch (modifier.modifier) {
        case "eq":
          dataQuery = dataQuery.eq(modifier.key, modifier.value);
          break;
        case "gt":
          dataQuery = dataQuery.gt(modifier.key, modifier.value);
          break;
        case "lt":
          dataQuery = dataQuery.lt(modifier.key, modifier.value);
          break;
        case "in":
          if (!Array.isArray(modifier.value)) {
            throw new Error("Value for 'in' modifier must be an array");
          }
          if (modifier.value.length > 100) {
            console.error("'in' modifier value has more than 100 items. This may cause performance issues.");
          }
          dataQuery = dataQuery.in(modifier.key, modifier.value);
          break;
      }
    }
    dataQuery = dataQuery.order("id", { ascending: true }).range(offset, offset + CHUNK_SIZE - 1);
    const { data, error } = await dataQuery;
    if (!error && data && data.length > 0) {
      allData.push(...data);
    } else {
      console.log(error);
    }
  }

  // Check uniqueness of the IDs in the data
  const allIdsUnique = allData.length === new Set(allData.map((item: any) => item["id"])).size;

  // if the ids are not unique, load the data again
  if (!allIdsUnique && allowRetries) {
    console.log(`Duplicate IDs found in ${tableName}. Refreshing data...`);
    const newResponse: ConnectionResponse<T[]> = await fetchLargeTable(tableName, selectString, modifiers, false);
    return newResponse;
  }

  return { data: allData, error: null };
};

export const updateCompany = async (companyId: string, company: Partial<Company>): Promise<ConnectionResponse<Company>> => {
  console.log("Updating company", companyId, company);
  const { data, error } = await supabase.from("companies").update(company).eq("id", companyId).select().returns<Company[]>();
  if (error || !data || data.length !== 1) {
    console.error("Error updating company", error);
    return { data: null, error: error?.message || "Error updating company" };
  }
  return { data: data[0], error: null };
};
