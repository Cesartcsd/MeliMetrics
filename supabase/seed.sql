insert into private.foundation_metadata (key, value)
values ('schema', '{"version": 1, "dataset": "synthetic"}'::jsonb)
on conflict (key) do update
set value = excluded.value;
