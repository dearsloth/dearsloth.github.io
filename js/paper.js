/**
 * Paper page: Chart.js visualizations (bilingual)
 * Percentages follow the thesis importance principle (top concepts).
 * null = not among that group's published top concepts (exact share not reported).
 */

const chartI18n = {
    zh: {
        barLabels: ['提高民眾負擔', '藥價合理化', '落實分級轉診', '取消總額', '開放自費醫療', '民眾先付費後理賠', '強化雲端系統'],
        clinicLabel: '基層西醫師 (%)',
        hospitalLabel: '醫院西醫師 (%)',
        xTitle: '建議佔比 (%)',
        ratioLabels: ['基層西醫師', '醫院西醫師'],
        naTooltip: '未列入該族群前 30% 主要概念'
    },
    en: {
        barLabels: [
            'Increase patient cost-sharing',
            'Rationalize drug pricing',
            'Implement tiered referral',
            'Abolish the global budget',
            'Open self-pay medical services',
            'Patients pay first, then claim',
            'Strengthen cloud systems'
        ],
        clinicLabel: 'Clinic-based western physicians (%)',
        hospitalLabel: 'Hospital-based western physicians (%)',
        xTitle: 'Share of recommendations (%)',
        ratioLabels: ['Clinic-based western physicians', 'Hospital-based western physicians'],
        naTooltip: 'Not among this group’s top 30% concepts'
    }
};

let comparisonChart = null;
let ratioChart = null;

function applyChartLang(lang) {
    const t = chartI18n[lang] || chartI18n.zh;

    if (comparisonChart) {
        comparisonChart.data.labels = t.barLabels;
        comparisonChart.data.datasets[0].label = t.clinicLabel;
        comparisonChart.data.datasets[1].label = t.hospitalLabel;
        comparisonChart.options.scales.x.title.text = t.xTitle;
        comparisonChart.options.plugins.tooltip.callbacks.label = (context) => {
            if (context.raw == null) {
                return ` ${context.dataset.label}: ${t.naTooltip}`;
            }
            return ` ${context.dataset.label}: ${context.raw}%`;
        };
        comparisonChart.update();
    }

    if (ratioChart) {
        ratioChart.data.labels = t.ratioLabels;
        ratioChart.update();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const comparisonCanvas = document.getElementById('comparisonChart');
    const ratioCanvas = document.getElementById('ratioChart');
    const t = chartI18n.zh;

    if (comparisonCanvas) {
        comparisonChart = new Chart(comparisonCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: t.barLabels,
                datasets: [
                    {
                        label: t.clinicLabel,
                        // Thesis: 12.44, 6.32, 4.25, 3.99, 3.11 (top 5 for clinic-based)
                        data: [12.44, 6.32, 4.25, 3.99, 3.11, null, null],
                        backgroundColor: '#0077B6',
                        borderRadius: 4
                    },
                    {
                        label: t.hospitalLabel,
                        // Thesis results: 14.47, 3.67, 3.47, 3.27, 3.77, 2.78 (top 6; sum ≈ 31.42%)
                        data: [14.47, 3.67, 3.47, 3.27, null, 3.77, 2.78],
                        backgroundColor: '#0EA5E9',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.raw == null) {
                                    return ` ${context.dataset.label}: ${t.naTooltip}`;
                                }
                                return ` ${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: '#E2E8F0' },
                        title: { display: true, text: t.xTitle, font: { size: 11 } }
                    },
                    y: { grid: { display: false } }
                }
            }
        });
    }

    if (ratioCanvas) {
        ratioChart = new Chart(ratioCanvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: t.ratioLabels,
                datasets: [{
                    data: [669, 363],
                    backgroundColor: ['#0077B6', '#0EA5E9'],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                cutout: '68%'
            }
        });
    }

    document.addEventListener('langchange', (e) => {
        applyChartLang(e.detail.lang);
    });
});
