//  INTERACTIVE CHARTS & DATA VISUALIZATION
// Advanced 3D Charts with Animations

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: "#00D9A3",
            secondary: "#667eea",
            accent: "#f093fb",
            warning: "#ffd93d",
            danger: "#ff6b6b",
            info: "#4facfe"
        };
        this.init();
    }

    init() {
        this.setupChartDefaults();
        this.createTicketTrendChart();
        this.createVouchRatingsChart();
        this.createActivityHeatmap();
        this.createProgressRings();
        this.createRealtimeCharts();
        this.startRealtimeUpdates();
    }

    setupChartDefaults() {
        Chart.defaults.font.family = "Segoe UI, Tahoma, Geneva, Verdana, sans-serif";
        Chart.defaults.color = "rgba(255, 255, 255, 0.8)";
        Chart.defaults.backgroundColor = "rgba(255, 255, 255, 0.1)";
        Chart.defaults.borderColor = "rgba(255, 255, 255, 0.2)";
        Chart.defaults.plugins.legend.display = true;
        Chart.defaults.plugins.legend.position = "top";
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.padding = 20;
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.animation.duration = 2000;
        Chart.defaults.animation.easing = "easeInOutQuart";
    }

    createTicketTrendChart() {
        const ctx = document.getElementById("ticketTrendChart");
        if (!ctx) return;

        this.charts.ticketTrend = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                    {
                        label: "Tickets Created",
                        data: [12, 19, 8, 15, 22, 17, 24],
                        borderColor: this.chartColors.primary,
                        backgroundColor: this.createGradient(ctx, this.chartColors.primary),
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.chartColors.primary,
                        pointBorderColor: "#ffffff",
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: "Tickets Closed",
                        data: [8, 15, 12, 18, 20, 14, 21],
                        borderColor: this.chartColors.secondary,
                        backgroundColor: this.createGradient(ctx, this.chartColors.secondary),
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.chartColors.secondary,
                        pointBorderColor: "#ffffff",
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "rgba(255, 255, 255, 0.9)",
                            font: { size: 14, weight: "600" }
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#ffffff",
                        bodyColor: "#ffffff",
                        borderColor: this.chartColors.primary,
                        borderWidth: 1,
                        cornerRadius: 10,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ": " + context.parsed.y + " tickets";
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                            borderColor: "rgba(255, 255, 255, 0.2)"
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)",
                            font: { size: 12 }
                        }
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                            borderColor: "rgba(255, 255, 255, 0.2)"
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 0.8)",
                            font: { size: 12 }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: "index"
                },
                animation: {
                    duration: 2000,
                    easing: "easeInOutQuart"
                }
            }
        });

        this.add3DEffect(ctx);
    }

    createVouchRatingsChart() {
        const ctx = document.getElementById("vouchRatingsChart");
        if (!ctx) return;

        this.charts.vouchRatings = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
                datasets: [{
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: [
                        this.chartColors.primary,
                        this.chartColors.secondary,
                        this.chartColors.accent,
                        this.chartColors.warning,
                        this.chartColors.danger
                    ],
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    borderWidth: 2,
                    hoverBorderWidth: 4,
                    hoverBorderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "rgba(255, 255, 255, 0.9)",
                            font: { size: 12, weight: "600" },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#ffffff",
                        bodyColor: "#ffffff",
                        borderColor: this.chartColors.primary,
                        borderWidth: 1,
                        cornerRadius: 10,
                        callbacks: {
                            label: function(context) {
                                const percentage = ((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return context.label + ": " + context.parsed + " (" + percentage + "%)";
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000,
                    easing: "easeInOutQuart"
                }
            }
        });

        this.add3DEffect(ctx);
    }

    createActivityHeatmap() {
        const container = document.getElementById("activityHeatmap");
        if (!container) return;

        const heatmapData = this.generateHeatmapData();
        const heatmapHTML = this.generateHeatmapHTML(heatmapData);
        container.innerHTML = heatmapHTML;

        // Add hover interactions
        this.addHeatmapInteractions(container);
    }

    generateHeatmapData() {
        const data = [];
        for (let week = 0; week < 12; week++) {
            const weekData = [];
            for (let day = 0; day < 7; day++) {
                weekData.push(Math.floor(Math.random() * 5));
            }
            data.push(weekData);
        }
        return data;
    }

    generateHeatmapHTML(data) {
        let html = "<div class=\"heatmap-container\">";
        data.forEach((week, weekIndex) => {
            week.forEach((day, dayIndex) => {
                html += `<div class="heatmap-cell" 
                           data-level="${day}" 
                           data-count="${day}"
                           data-week="${weekIndex}"
                           data-day="${dayIndex}">
                         </div>`;
            });
        });
        html += "</div>";
        return html;
    }

    addHeatmapInteractions(container) {
        const cells = container.querySelectorAll(".heatmap-cell");
        cells.forEach(cell => {
            cell.addEventListener("mouseenter", () => {
                const count = cell.dataset.count;
                const week = cell.dataset.week;
                const day = cell.dataset.day;
                this.showHeatmapTooltip(cell, count, week, day);
            });

            cell.addEventListener("mouseleave", () => {
                this.hideHeatmapTooltip();
            });
        });
    }

    showHeatmapTooltip(element, count, week, day) {
        const tooltip = document.createElement("div");
        tooltip.id = "heatmap-tooltip";
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            border: 1px solid ${this.chartColors.primary};
        `;
        tooltip.textContent = `${count} activities`;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px";
    }

    hideHeatmapTooltip() {
        const tooltip = document.getElementById("heatmap-tooltip");
        if (tooltip) {
            tooltip.remove();
        }
    }

    createProgressRings() {
        const containers = document.querySelectorAll(".progress-ring");
        containers.forEach((container, index) => {
            const percentage = [85, 72, 94][index] || 50;
            this.createProgressRing(container, percentage);
        });
    }

    createProgressRing(container, percentage) {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.innerHTML = `
            <defs>
                <linearGradient id="gradient-${Date.now()}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${this.chartColors.primary};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${this.chartColors.secondary};stop-opacity:1" />
                </linearGradient>
            </defs>
            <circle class="bg" cx="50%" cy="50%" r="${radius}"></circle>
            <circle class="progress" cx="50%" cy="50%" r="${radius}" 
                    stroke-dasharray="${circumference}" 
                    stroke-dashoffset="${circumference}">
            </circle>
        `;

        const textElement = document.createElement("div");
        textElement.className = "progress-ring-text";
        textElement.textContent = percentage + "%";

        container.appendChild(svg);
        container.appendChild(textElement);

        // Animate the progress ring
        setTimeout(() => {
            const progressCircle = svg.querySelector(".progress");
            progressCircle.style.strokeDashoffset = offset;
        }, 500);
    }

    createRealtimeCharts() {
        // Real-time activity chart
        const ctx = document.getElementById("realtimeChart");
        if (!ctx) return;

        this.charts.realtime = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Tickets", "Vouches", "Verifications", "Support"],
                datasets: [{
                    label: "Today",
                    data: [15, 8, 23, 12],
                    backgroundColor: [
                        this.chartColors.primary,
                        this.chartColors.secondary,
                        this.chartColors.accent,
                        this.chartColors.info
                    ],
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    borderWidth: 1,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#ffffff",
                        bodyColor: "#ffffff",
                        borderColor: this.chartColors.primary,
                        borderWidth: 1,
                        cornerRadius: 10
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: "rgba(255, 255, 255, 0.8)" }
                    },
                    y: {
                        grid: { color: "rgba(255, 255, 255, 0.1)" },
                        ticks: { color: "rgba(255, 255, 255, 0.8)" }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: "easeInOutBounce"
                }
            }
        });
    }

    createGradient(ctx, color) {
        const gradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color + "40");
        gradient.addColorStop(1, color + "00");
        return gradient;
    }

    add3DEffect(canvas) {
        canvas.parentElement.classList.add("chart-3d");
        
        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            canvas.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        canvas.addEventListener("mouseleave", () => {
            canvas.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        });
    }

    startRealtimeUpdates() {
        setInterval(() => {
            this.updateRealtimeData();
        }, 5000);
    }

    updateRealtimeData() {
        if (this.charts.realtime) {
            const newData = [
                Math.floor(Math.random() * 30) + 10,
                Math.floor(Math.random() * 20) + 5,
                Math.floor(Math.random() * 40) + 15,
                Math.floor(Math.random() * 25) + 8
            ];

            this.charts.realtime.data.datasets[0].data = newData;
            this.charts.realtime.update("active");

            // Add update animation
            const chartContainer = this.charts.realtime.canvas.closest(".chart-container");
            if (chartContainer) {
                chartContainer.classList.add("data-update-pulse");
                setTimeout(() => {
                    chartContainer.classList.remove("data-update-pulse");
                }, 1000);
            }
        }
    }

    // Public methods for external updates
    updateChart(chartName, newData) {
        if (this.charts[chartName]) {
            this.charts[chartName].data.datasets[0].data = newData;
            this.charts[chartName].update("active");
        }
    }

    animateNumber(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = newValue > currentValue ? 1 : -1;
        const timer = setInterval(() => {
            const current = parseInt(element.textContent) || 0;
            if (current === newValue) {
                clearInterval(timer);
                element.classList.remove("updating");
            } else {
                element.textContent = current + increment;
                element.classList.add("updating");
            }
        }, 50);
    }
}

// Initialize charts when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.dashboardCharts = new DashboardCharts();
});

// Export for external use
window.DashboardCharts = DashboardCharts;
