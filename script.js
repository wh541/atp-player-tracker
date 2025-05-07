let apiKey = sessionStorage.getItem("apiKey");

if (!apiKey) {
  apiKey = prompt("Enter your SportsDataIO API key:");
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
  const url = `https://api.sportsdata.io/v4/tennis/scores/json/Players`;
  console.log("🔍 Fetching player list...");

  fetch(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("API request failed. Check your key or quota.");
      }
      return response.json();
    })
    .then(data => {
      console.log("✅ Player list retrieved:", data);

      const player = data.find(p =>
        `${p.FirstName.toLowerCase()} ${p.LastName.toLowerCase()}` === name.toLowerCase()
      );

      if (!player) {
        alert("Player not found. Try the full name exactly.");
        return;
      }

      console.log("🎾 Found player:", player);

      document.getElementById("playerName").textContent = `${player.FirstName} ${player.LastName}`;
      document.getElementById("playerCountry").textContent = player.Country || "N/A";
      document.getElementById("playerRanking").textContent = player.Rank || "N/A";
      document.getElementById("playerPoints").textContent = player.RankPoints || "N/A";
    })
    .catch(error => {
      console.error("❌ Fetch error:", error);
      alert("Error fetching player info. Check your API key or internet connection.");
    });
}

