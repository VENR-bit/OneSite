// Supabase client configuration
const SUPABASE_URL = "https://megebtfqaovaciovrzyb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZ2VidGZxYW92YWNpb3ZyenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzMwMjEsImV4cCI6MjA4OTUwOTAyMX0.HTIS6kM0XOfhbaor8kfybTHc-YbYB3BYRiCoJd-YHSU";

window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function daysSince(dateStr) {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function dbToItem(row) {
  return {
    id: row.id,
    en: row.en || "",
    si: row.si || "",
    desc: row.description || "",
    price: row.price || 0,
    qty: row.qty || 1,
    pledged: row.pledged || 0,
    category: row.category || "",
    priority: row.priority || "routine",
    icon: row.icon || "bowl",
    photo: row.photo || "",
    addedDays: daysSince(row.added_at),
  };
}

function itemToDb(item) {
  const row = {
    en: item.en,
    si: item.si || "",
    description: item.desc || "",
    price: item.price || 0,
    qty: item.qty || 1,
    pledged: item.pledged || 0,
    category: item.category || null,
    priority: item.priority || "routine",
    icon: item.icon || "bowl",
    photo: item.photo || "",
  };
  return row;
}

async function sbFetchItems() {
  const { data, error } = await window.sbClient
    .from("items")
    .select("*")
    .order("id", { ascending: true });
  if (error) { console.error("sbFetchItems:", error); return []; }
  return data.map(dbToItem);
}

async function sbInsertItem(item) {
  const row = itemToDb(item);
  row.added_at = new Date().toISOString();
  const { error } = await window.sbClient
    .from("items")
    .insert(row);
  if (error) { console.error("sbInsertItem:", error); return null; }
  // Fetch the newly inserted item (last by id)
  const { data: fetched, error: fetchErr } = await window.sbClient
    .from("items")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single();
  if (fetchErr) { console.error("sbInsertItem fetch:", fetchErr); return null; }
  return dbToItem(fetched);
}

async function sbUpdateItem(id, updates) {
  const row = {};
  if (updates.en !== undefined) row.en = updates.en;
  if (updates.si !== undefined) row.si = updates.si;
  if (updates.desc !== undefined) row.description = updates.desc;
  if (updates.price !== undefined) row.price = updates.price;
  if (updates.qty !== undefined) row.qty = updates.qty;
  if (updates.pledged !== undefined) row.pledged = updates.pledged;
  if (updates.category !== undefined) row.category = updates.category || null;
  if (updates.priority !== undefined) row.priority = updates.priority;
  if (updates.icon !== undefined) row.icon = updates.icon;
  if (updates.photo !== undefined) row.photo = updates.photo;
  row.updated_at = new Date().toISOString();
  const { error } = await window.sbClient
    .from("items")
    .update(row)
    .eq("id", id);
  if (error) { console.error("sbUpdateItem:", error); return null; }
  // Fetch the updated item separately
  const { data: fetched, error: fetchErr } = await window.sbClient
    .from("items")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchErr) { console.error("sbUpdateItem fetch:", fetchErr); return null; }
  return dbToItem(fetched);
}

async function sbDeleteItem(id) {
  const { error } = await window.sbClient
    .from("items")
    .delete()
    .eq("id", id);
  if (error) { console.error("sbDeleteItem:", error); return false; }
  return true;
}

async function sbInsertPledge(itemId, name, qty) {
  const { error } = await window.sbClient
    .from("pledges")
    .insert({ item_id: itemId, name: name || "Anonymous", qty });
  if (error) { console.error("sbInsertPledge:", error); return false; }
  return true;
}

window.sbFetchItems = sbFetchItems;
window.sbInsertItem = sbInsertItem;
window.sbUpdateItem = sbUpdateItem;
window.sbDeleteItem = sbDeleteItem;
window.sbInsertPledge = sbInsertPledge;
