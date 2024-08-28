import { supabase } from "@shared/context/AuthProvider";
import { StorageObject } from "@shared/types/global/storage";
import { ConnectionResponse } from "@shared/types/response";
import { v4 as uuidv4 } from "uuid";

export const renderableExtensions = [
  "html",
  "htm",
  "css",
  "js",
  "json",
  "xml",
  "png",
  "jpeg",
  "jpg",
  "gif",
  "svg",
  "pdf",
  "bmp",
  "ico",
  "tiff",
  "tif",
  "webp",
  "mp4",
  "m4v",
  "webm",
  "ogg",
  "ogv",
  "avi",
  "mov",
];

/** Sends a blob to the to the user's downloads folder.
 *  If the file is browser renderable, it will also be opened in a new tab.
 *
 * @param {string} url - Blob URL for the file.
 * @param {string} fileName - Name of the file.
 */
export const sendToDownloadsFolder = (url: string, fileName: string, openInBrowser?: boolean) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  const extension = fileName.split(".").pop() ?? "txt";
  if (renderableExtensions.includes(extension.toLowerCase()) && openInBrowser) {
    window.open(url, "_blank");
  }
};

/**
 * Fetches a file stored in a Supabase storage bucket and returns a blob URL for the file.
 * Optionally, the file can be reduced in size and / or automatically downloaded to the user's downloads folder.
 *
 * @param {string} companyId - Identifier for the company owning the file.
 * @param {string} bucketName - Name of the Supabase storage bucket.
 * @param {string} fileId - Identifier for the file within the bucket.
 * @param {object} options - Optional parameters.
 *
 * @returns {Promise<string|null>} - Returns a blob URL for the file if successful, or null if an error occurs.
 *
 * @async
 */
export const fetchStorageObject = async (
  companyId: string,
  bucketName: string,
  fileId: string,
  options?: {
    fileName?: string;
    sendToDownloads?: boolean;
    imageQuality?: "high" | "medium" | "low";
    asObject?: boolean;
  },
): Promise<ConnectionResponse<StorageObject | string>> => {
  let queryOptions = {};
  switch (options?.imageQuality) {
    case "low":
      queryOptions = { transform: { width: 400, resize: "contain" } };
      break;
    case "medium":
      queryOptions = { transform: { width: 700, resize: "contain" } };
      break;
    case "high":
    default:
      break;
  }

  const { data, error } = await supabase.storage.from(bucketName).download(`${companyId}/${fileId}`, queryOptions);

  if (error) {
    console.error(error);
    return { data: null, error: error.message };
  }

  // Create a blob url from the data
  const blob = new Blob([data], { type: data.type });
  const url = URL.createObjectURL(blob);

  // Download the file if sendToDownloadsFolder is true
  if (options?.sendToDownloads) {
    sendToDownloadsFolder(url, options.fileName ?? fileId, false);
  }

  if (options?.asObject) {
    const { data: storageObject, error: storageObjectError } = await supabase
      .from("storage_objects")
      .select()
      .eq("id", fileId)
      .returns<StorageObject[]>();
    if (storageObjectError || !storageObject || storageObject.length !== 1) {
      console.error(storageObjectError);
      return { data: null, error: `Error fetching storage object: ${storageObjectError?.message}` };
    }
    return { data: { ...storageObject[0], url }, error: null };
  }

  return { data: url, error: null };
};

export const fetchStorageObjectSize = async (fileId: string, companyId: string, bucketName: string): Promise<number | null> => {
  const { data, error } = await supabase
    .schema("storage")
    .from("objects")
    .select("metadata")
    .eq("bucket_id", bucketName)
    .eq("name", `${companyId}/${fileId}`);
  if (error || data[0]?.metadata?.size === undefined) {
    console.error(error ?? "Error fetching file size", data);
    return null;
  }
  if (data.length !== 1) {
    console.error("Unexpected number of results from fetchFileSize", data);
    return null;
  }
  return data[0].metadata.size;
};

export const insertStorageObject = async (
  file: File | Blob,
  companyId: string,
  bucketName: string,
  options?: {
    storageObjectId?: string;
    path?: string;
    fileName?: string;
    upsert?: boolean;
  },
): Promise<ConnectionResponse<StorageObject>> => {
  const newStorageObjectId = options?.storageObjectId ?? uuidv4();
  // convert to blob if file is a File
  const fileName = options?.fileName ?? (file instanceof File ? file.name : null);
  const blob = file instanceof File ? new Blob([file], { type: file.type }) : file;
  if (!blob) {
    return { data: null, error: "No file provided" };
  }

  // Upload the file to the storage bucket
  const { data: object, error: objectError } = await supabase.storage
    .from(bucketName)
    .upload(`${companyId}${options?.path ? `/${options.path}` : ""}/${newStorageObjectId}`, blob, {
      cacheControl: "3600",
      upsert: options?.upsert ?? false,
    });

  if (objectError || !object?.id) {
    console.error(objectError);
    return { data: null, error: objectError?.message ?? "Error uploading file" };
  }

  // Update the storage_objects table to retain the original file name
  const { data: updatedStorageObject, error: updatedStorageObjectError } = await supabase
    .from("storage_objects")
    .update({ file_name: fileName })
    .eq("id", newStorageObjectId)
    .eq("storage_object_id", object?.id)
    .select()
    .returns<StorageObject[]>();

  if (updatedStorageObjectError || !updatedStorageObject) {
    console.error(updatedStorageObjectError);
    return { data: null, error: `Error updating storage object name: ${updatedStorageObjectError?.message}` };
  }

  return { data: updatedStorageObject[0], error: null };
};

export const deleteStorageObject = async (
  companyId: string,
  bucketName: string,
  storageObjectId: string | string[],
  options?: { path?: string },
) => {
  const removalPaths: string[] = [];
  if (Array.isArray(storageObjectId)) {
    removalPaths.push(...storageObjectId.map((id) => `${companyId}${options?.path ? `/${options.path}` : ""}/${id}`));
  } else {
    removalPaths.push(`${companyId}${options?.path ? `/${options.path}` : ""}/${storageObjectId}`);
  }
  const { error } = await supabase.storage.from(bucketName).remove(removalPaths);
  if (error) {
    console.error(error);
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
};
