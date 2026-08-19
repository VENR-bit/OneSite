/* ──────────────────────────────────────────────────────────────
   Rideekanda — Herbal Plant Planting Programme
   Supabase access layer, shared by the public page and the admin page.

   The schema lives in supabase-setup.sql. Reads go through the
   plant_pledges_public view (which omits the private token); photo
   uploads go through the attach_plant_photo() function, which checks
   the token server-side.
   ────────────────────────────────────────────────────────────── */
(function () {
  var SUPABASE_URL = "https://megebtfqaovaciovrzyb.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZ2VidGZxYW92YWNpb3ZyenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzMwMjEsImV4cCI6MjA4OTUwOTAyMX0.HTIS6kM0XOfhbaor8kfybTHc-YbYB3BYRiCoJd-YHSU";
  var BUCKET = "plant-photos";

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // True once we know the tables exist; the page degrades politely if the
  // SQL setup hasn't been run yet rather than throwing at every click.
  var ready = null;

  function fetchPledges() {
    return sb.from("plant_pledges_public")
      .select("*")
      .order("created_at", { ascending: false })
      .then(function (res) {
        if (res.error) { ready = false; console.error("fetchPledges:", res.error.message); return null; }
        ready = true;
        return res.data || [];
      });
  }

  function createPledge(p) {
    return sb.from("plant_pledges")
      .insert({
        plant_no: p.no || null,
        plant_list: p.list,
        sinhala: p.sinhala || null,
        sinhala_script: p.script || null,
        english: p.english || null,
        scientific: p.scientific,
        pledger_name: p.name,
        contact: p.contact || null,
        qty: p.qty || 1,
        note: p.note || null
      })
      .select("id, token")
      .single()
      .then(function (res) {
        if (res.error) { console.error("createPledge:", res.error.message); return null; }
        return res.data;
      });
  }

  // Upload the photo under the secret token, then let the DB verify the
  // token and mark the pledge as awaiting approval.
  function uploadPhoto(token, file) {
    var ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["jpg", "jpeg", "png", "webp", "heic"].indexOf(ext) === -1) ext = "jpg";
    var path = "pledges/" + token + "-" + Date.now() + "." + ext;
    return sb.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" })
      .then(function (res) {
        if (res.error) throw new Error(res.error.message);
        return sb.rpc("attach_plant_photo", { p_token: token, p_path: path });
      })
      .then(function (res) {
        if (res.error) throw new Error(res.error.message);
        if (res.data !== true) throw new Error("That link is not valid. Please check you copied all of it.");
        return path;
      });
  }

  function publicUrl(path) {
    if (!path) return "";
    return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  // Admin: change a submitted photo's moderation state.
  function setPhotoStatus(id, status) {
    return sb.from("plant_pledges").update({ photo_status: status }).eq("id", id)
      .then(function (res) {
        if (res.error) { console.error("setPhotoStatus:", res.error.message); return false; }
        return true;
      });
  }

  window.RK_PLANTS_DB = {
    fetchPledges: fetchPledges,
    createPledge: createPledge,
    uploadPhoto: uploadPhoto,
    publicUrl: publicUrl,
    setPhotoStatus: setPhotoStatus,
    isReady: function () { return ready; }
  };
})();
