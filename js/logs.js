(async () => {
  const params = new URLSearchParams(document.location.search);
  const pid = parseInt(params.get("pid"));
  if (!pid) return;

  document.getElementById("names").href = `/player.html?pid=${pid}`;
  const page = parseInt(params.get("page")) || 1;

  document.getElementById("loading").style.display = "block";
  const response = await fetch(
    `https://glassfrog.duckdns.org/logs?pid=${pid}&page=${page}`
  );
  const data = await response.json();
  document.getElementById("loading").style.display = "none";

  if (data.blacklisted) {
    location.href = "https://youtu.be/dQw4w9WgXcQ";
    return;
  }

  if (!data.rows.length) {
    const header = document.createElement("p");
    header.innerText = "No results 😱";
    document.body.appendChild(header);
    return;
  }

  const table = document.getElementById("logstable");
  for (const record of data.rows) {
    const row = table.insertRow(-1);
    row.insertCell(-1).innerText = record.name;
    row.insertCell(-1).innerText = { 19736: "life", 397528: "events" }[
      record.sid
    ];
    row.insertCell(-1).innerText = parseDate(record.add) || "";
    row.insertCell(-1).innerText = parseDate(record.remove);
    if (!record.add || !record.remove) continue;
    row.insertCell(-1).innerText = timeBetween(
      new Date(record.add),
      new Date(record.remove)
    );
  }

  document.getElementById("logstable").style.display = null;

  if (page > 1) {
    const anchor = document.getElementById("previous");
    anchor.href = `/logs.html?pid=${pid}&page=${page - 1}`;
    anchor.classList.remove("offline");
  }

  if (data.next) {
    const anchor = document.getElementById("next");
    anchor.href = `/logs.html?pid=${pid}&page=${page + 1}`;
    anchor.classList.remove("offline");
  }
})();
