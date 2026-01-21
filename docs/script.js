// script.js

let videoData;
const chartRegistry = {};

async function fetchData() {
  try {
    const res = await fetch("data.json");
    videoData = await res.json();
    document.getElementById("summary").innerHTML = `
      <table>
        <tr><th>Video</th><td>${videoData.video_path}</td></tr>
        <tr><th>Total Frames</th><td>${videoData.total_frames}</td></tr>
        <tr><th>Average FPS</th><td>${videoData.average_fps.toFixed(2)}</td></tr>
      </table>
      <p class="summary-note"><em>This dataset is extracted from video inference. Explore individual or comparative views of inference performance and prediction confidence.</em></p>
    `;
    setupTopicCards();
    setupChartModeToggle();
    renderCharts();
    setupListeners();
    annotateMediaCaptions();
  } catch (error) {
    document.getElementById("summary").innerHTML = "<p style='color:red;'>Failed to load data.json</p>";
    console.error("Error loading data:", error);
  }
}

function setupTopicCards() {
  const container = document.getElementById("topicSelector");
  container.innerHTML = `
    <div class="topic-cards">
      <div class="card-btn" data-topic="classification">
        <img src="icons/classification.svg" alt="Classification" />
        <h3>Classification</h3>
        <p><em>Track label confidence and distribution.</em></p>
      </div>
      <div class="card-btn" data-topic="specialization">
        <img src="icons/specialization.svg" alt="Specialization" />
        <h3>Specialization</h3>
        <p><em>Color and Direction Detection.</em></p>
      </div>
    </div>
  `;

  document.querySelectorAll(".card-btn").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".card-btn").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const topic = card.dataset.topic;

      document.querySelectorAll(".media-gallery").forEach(gallery => {
        gallery.style.display = "none";
        gallery.classList.remove("show");
      });

      const selected = document.getElementById(`${topic}-media`);
      if (selected) {
        selected.style.display = "flex";
        void selected.offsetWidth;
        selected.classList.add("show");
      }
    });
  });
  const firstCard = document.querySelector(".card-btn");
  if (firstCard) firstCard.click();
}


function setupChartModeToggle() {
  const container = document.getElementById("chartControlContainer");
  container.innerHTML = `
    <p><em>Select how you want to explore chart data:</em></p>
    <div class="mode-toggle">
      <label><input type="radio" name="viewMode" value="single" checked> Single Chart</label>
      <label><input type="radio" name="viewMode" value="compare"> Compare Charts</label>
    </div>
    <div id="singleChartSelect"></div>
    <div id="compareChartSelect" style="display:none;"></div>
  `;
}

function annotateMediaCaptions() {
  document.querySelectorAll(".media-gallery img").forEach((img, index) => {
    const caption = document.createElement("figcaption");
    caption.innerHTML = `<em>${index + 1}. Image: ${img.alt || "Output"}</em>`;
    const wrapper = document.createElement("figure");
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(caption);
  });

  document.querySelectorAll(".media-gallery video").forEach((vid, index) => {
    const caption = document.createElement("figcaption");
    caption.innerHTML = `<em>${index + 1}. Video Insight</em>`;
    const wrapper = document.createElement("figure");
    vid.parentNode.insertBefore(wrapper, vid);
    wrapper.appendChild(vid);
    wrapper.appendChild(caption);
  });
}

function renderCharts() {
  const singleSelect = document.createElement("select");
  singleSelect.id = "chartSelector";
  singleSelect.innerHTML = `<option value="">None</option>`;
  document.getElementById("singleChartSelect").appendChild(singleSelect);

  const compareSelect = document.createElement("select");
  compareSelect.id = "compareSelector";
  compareSelect.multiple = true;
  compareSelect.size = 6;
  document.getElementById("compareChartSelect").appendChild(compareSelect);

  const chartsContainer = document.getElementById("charts");
  const compareContainer = document.getElementById("compareCharts");
  chartsContainer.innerHTML = "";
  compareContainer.innerHTML = "";
  Object.values(chartRegistry).forEach(chart => chart.destroy());
  Object.keys(chartRegistry).forEach(key => delete chartRegistry[key]);

  const frameIds = videoData.frames.map(f => f.frame_id);
  const inference = videoData.frames.map(f => f.inference_time_ms);
  const cpu = videoData.frames.map(f => f.cpu_percent);
  const ram = videoData.frames.map(f => f.ram_usage_mb);

  const labelStats = {};
  const labelOverTime = {};

  videoData.frames.forEach(frame => {
    const frameIndex = frame.frame_id;
    frame.predictions.forEach(p => {
      if (!labelStats[p.label]) {
        labelStats[p.label] = { totalConfidence: 0, count: 0 };
      }
      labelStats[p.label].totalConfidence += p.confidence;
      labelStats[p.label].count++;

      if (!labelOverTime[p.label]) {
        labelOverTime[p.label] = [];
      }
      labelOverTime[p.label][frameIndex] = p.confidence;
    });
  });

  const labels = Object.keys(labelStats);
  const avgConfidence = labels.map(l => labelStats[l].totalConfidence / labelStats[l].count);
  const labelCounts = labels.map(l => labelStats[l].count);

  const staticCharts = [
    { id: 'inferenceChart', label: 'Inference Time (ms)', data: inference, color: 'blue' },
    { id: 'cpuChart', label: 'CPU Usage (%)', data: cpu, color: 'green' },
    { id: 'ramChart', label: 'RAM Usage (MB)', data: ram, color: 'red' },
    { id: 'avgConfidenceChart', label: 'Average Confidence by Label', data: avgConfidence, labels, type: 'bar', color: 'orange' },
    { id: 'labelFrequencyChart', label: 'Prediction Frequency by Label', data: labelCounts, labels, type: 'bar', color: 'purple' }
  ];

  staticCharts.forEach(({ id, label, data, labels: xLabels = frameIds, type = 'line', color }) => {
    const canvas = document.createElement("canvas");
    const wrapper = document.createElement("div");
    wrapper.className = "chart-container";
    wrapper.id = `wrap_${id}`;
    canvas.id = id;
    wrapper.appendChild(canvas);
    chartsContainer.appendChild(wrapper);

    chartRegistry[id] = new Chart(canvas, {
      type,
      data: {
        labels: xLabels,
        datasets: [{ label, data, borderColor: color, backgroundColor: color, tension: 0.3, fill: false }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { title: { display: true, text: 'Frame ID' } },
          y: { title: { display: true, text: label } }
        }
      }
    });

    singleSelect.appendChild(new Option(label, `wrap_${id}`));
  });

  Object.entries(labelOverTime).forEach(([label, data]) => {
    const id = `chart_${label}`;
    const wrapper = document.createElement("div");
    wrapper.className = "chart-container";
    wrapper.id = `wrap_${id}`;
    const canvas = document.createElement("canvas");
    canvas.id = id;
    wrapper.appendChild(canvas);
    chartsContainer.appendChild(wrapper);

    chartRegistry[id] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: frameIds,
        datasets: [{
          label: `Confidence Over Time: ${label}`,
          data: data.map(c => c || null),
          borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
          tension: 0.3,
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { title: { display: true, text: 'Frame ID' } },
          y: { title: { display: true, text: 'Confidence' }, min: 0, max: 1 }
        }
      }
    });

    singleSelect.appendChild(new Option(`Confidence Over Time: ${label}`, `wrap_${id}`));
    compareSelect.appendChild(new Option(`Confidence Over Time: ${label}`, id));
  });

  singleSelect.addEventListener("change", () => {
    document.querySelectorAll('.chart-container').forEach(div => div.classList.remove('active'));
    const selected = singleSelect.value;
    if (selected) {
      const container = document.getElementById(selected);
      container.style.opacity = 0;
      container.classList.add("active");
      requestAnimationFrame(() => {
        container.style.opacity = 1;
      });
    }    
  });

  compareSelect.addEventListener("change", () => {
    const selected = Array.from(compareSelect.selectedOptions).map(o => o.value).filter(Boolean);
    const compareContainer = document.getElementById("compareCharts");
    compareContainer.innerHTML = "";
    if (selected.length === 2) {
      selected.forEach(id => {
        const srcChart = chartRegistry[id];
        if (!srcChart) return;
        const canvas = document.createElement("canvas");
        compareContainer.appendChild(canvas);
        new Chart(canvas, {
          type: 'line',
          data: JSON.parse(JSON.stringify(srcChart.data)),
          options: JSON.parse(JSON.stringify(srcChart.options))
        });
      });
    }
  });

  document.querySelectorAll("input[name='viewMode']").forEach(radio => {
    radio.addEventListener("change", e => {
      const mode = e.target.value;
      document.getElementById("singleChartSelect").style.display = mode === "single" ? "block" : "none";
      document.getElementById("compareChartSelect").style.display = mode === "compare" ? "block" : "none";
      document.getElementById("compareCharts").style.display = mode === "compare" ? "flex" : "none";
      if (mode === "single") {
        document.getElementById("chartSelector").dispatchEvent(new Event("change"));
      }
    });
  });
  document.getElementById("chartSelector").selectedIndex = 1;
  document.getElementById("chartSelector").dispatchEvent(new Event("change"));

}

function setupListeners() {
  document.querySelectorAll("input[name='topicMode']").forEach(radio => {
    radio.addEventListener("change", e => {
      document.getElementById("classification-media").style.display = e.target.value === "classification" ? "flex" : "none";
      document.getElementById("specialization-media").style.display = e.target.value === "specialization" ? "flex" : "none";
    });
  });
}

fetchData();

tsParticles.load("particles-js", {
  particles: {
    number: { value: 40 },
    color: { value: "#bbb" },
    size: { value: 3 },
    move: { enable: true, speed: 0.6 }
  },
  interactivity: {
    events: { onhover: { enable: true, mode: "repulse" } }
  }
});

