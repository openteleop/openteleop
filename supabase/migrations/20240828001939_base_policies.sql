-- Companies table

create policy "companies_select" 
on public.companies
as PERMISSIVE 
for select 
to authenticated 
using (
    (id = auth.user_company_id())
);
create policy "companies_update"
on public.companies
as PERMISSIVE 
for update 
to authenticated 
using (
    ((id = auth.user_company_id()) AND (auth.user_role() = 'admin'::text))
) with check (
    ((id = auth.user_company_id()) AND (auth.user_role() = 'admin'::text))
);


-- Users table

create policy "users_select" 
on public.users
as PERMISSIVE 
for select 
to authenticated 
using (
    (company_id = auth.user_company_id())
);

create policy "users_update" 
on public.users
as PERMISSIVE 
for update 
to authenticated 
using (
    (company_id = auth.user_company_id()) AND ((id = auth.uid()) OR (auth.user_role() = 'admin'::text))
)with check (
    (company_id = auth.user_company_id()) AND ((id = auth.uid()) OR (auth.user_role() = 'admin'::text))
);