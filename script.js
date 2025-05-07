let apiKey = sessionStorage.getItem("apiKey");

if (!apiKey) {
  apiKey = prompt("Enter your API-Tennis key:");
  sessionStorage.setItem("apiKey", apiKey);
}

const searchBtn = document.getElementById("searchBtn");
const playerSearch = document.getElementById("playerSearch");

searchBtn.addEventListener("click", () => {
  const playerName = playerSearch.value.trim();
  if (playerName !== "") {
    fetchPlayerInfo(playerName);
  }
});

function fetchPlayerInfo(name) {
  const url = `https://api.api-tennis.com/tennis/?method=get_players&name=${encodeURIComponent(name)}&APIkey=${apiKey}`;
  console.log("🔍 Fetching player from:", url);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("📦 Player API response:", data);

      if (!data.result || data.result.length === 0) {
        alert("Player not found. Try using full name like 'Rafael Nadal'.");
        return;
      }

      const player = data.result[0];

      // Update HTML
      document.getElementById("playerName").textContent = `${player.firstname} ${player.lastname}`;
      document.getElementById("playerCountry").textContent = player.country;
      document.getElementById("playerRank").textContent = player.rank;
      document.getElementById("playerPoints").textContent = player.points;
      document.getElementById("player-info").classList.remove("hidden");

      // Now get their match history
      fetchRecentMatches(player.player_key);
    })
    .catch(error => {
      console.error("❌ Error fetching player:", error);
      alert("Something went wrong. Please check the console.");
    });
}

function fetchRecentMatches(playerKey) {
  const url = `https://api.api-tennis.com/tennis/?method=get_results&player_key=${playerKey}&APIkey=${apiKey}`;
  console.log("🎾 Fetching match results from:", url);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("📦 Match API response:", data);

      const matchList = document.getElementById("matchList");
      matchList.innerHTML = "";

      if (!data.result || data.result.length === 0) {
        matchList.innerHTML = "<li>No recent matches found.</li>";
        return;
      }

      data.result.slice(0, 5).forEach(match => {
        const li = document.createElement("li");
        li.textContent = `${match.event} — ${match.event_date} — ${match.score}`;
        matchList.appendChild(li);
      });

      document.getElementById("matches").classList.remove("hidden");
    })
    .catch(error => {
      console.error("❌ Error fetching matches:", error);
      alert("Error loading match data.");
    });
}
