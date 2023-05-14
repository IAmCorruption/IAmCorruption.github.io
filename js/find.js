(async () => {
  const params = new URLSearchParams(document.location.search);
  const name = params.get("name");
  const page = parseInt(params.get("page")) || 1;

  document.getElementById("loading").style.display = "block";
  const response = await fetch(
    `https://glassfrog.duckdns.org/find?name=${encodeURIComponent(
      name
    )}&page=${page}`
  );
  const data = await response.json();
  document.getElementById("loading").style.display = "none";

  if (!data.rows.length) {
    const header = document.createElement("p");
    header.innerText = "No results 😱";
    document.body.appendChild(header);
    return;
  }

  const table = document.getElementById("findtable");
  for (const record of data.rows) {
    const row = table.insertRow(-1);
    const anchor = document.createElement("a");
    anchor.innerText = record.name;
    anchor.href = `/logs.html?pid=${record.pid}`;
    row.insertCell(-1).appendChild(anchor);
    row.insertCell(-1).innerText = { 19736: "life", 397528: "events" }[
      record.sid
    ];
    row.insertCell(-1).innerText = parseDate(new Date(record.biggest));
  }

  document.getElementById("findtable").style.display = null;

  if (page > 1) {
    const anchor = document.getElementById("previous");
    anchor.href = `/find.html?name=${encodeURIComponent(name)}&page=${
      page - 1
    }`;
    anchor.classList.remove("offline");
  }

  if (data.next) {
    const anchor = document.getElementById("next");
    anchor.href = `/find.html?name=${encodeURIComponent(name)}&page=${
      page + 1
    }`;
    anchor.classList.remove("offline");
  }
})();
