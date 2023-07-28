<template>
    <div class="kpi-container">
        <div class="kpi-name">{{ name }}</div>
        <div class="kpi-gauge-container">
            <svg class="kpi-gauge" :width="gaugeSize" :height="gaugeSize">
                <circle class="kpi-gauge-background" :cx="gaugeCenter" :cy="gaugeCenter" :r="gaugeRadius" />
                <circle class="kpi-gauge-progress" :cx="gaugeCenter" :cy="gaugeCenter" :r="gaugeRadius"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - (progressPercentage * circumference) / 100" :stroke="barColor" />
            </svg>
            <div class="kpi-values">
                {{ currentValue }}
                <br>
                Target: {{ kpiValue }}
            </div>
            <div class="kpi-date">
                {{formatStart}} to {{formatEnd}}
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        kpiValue: {
            type: Number,
            required: true,
        },
        currentValue: {
            type: Number,
            required: true,
        },
        start: {
            type: String,
            default: '',
        },
        end: {
            type: String,
            default: '',
        },
    },
    computed: {
        formatStart() {
            return this.start.split('T')[0];
        },
        formatEnd() {
            return this.end.split('T')[0];
        },
        progressPercentage() {
            return (this.currentValue / this.kpiValue) * 100;
        },
        barColor() {
            // Adjust the colors as per your requirement
            if (this.progressPercentage >= 100) {
                return 'green'; // 100% or more, green color
            } else if (this.progressPercentage >= 50) {
                return 'yellow'; // 50% or more, yellow color
            } else {
                return 'red'; // Less than 50%, red color
            }
        },
        // SVG gauge properties
        gaugeSize() {
            return 120; // Adjust the size of the gauge here
        },
        gaugeCenter() {
            return this.gaugeSize / 2;
        },
        gaugeRadius() {
            return this.gaugeSize / 2 - 5; // Adjust the thickness of the gauge here
        },
        circumference() {
            return 2 * Math.PI * this.gaugeRadius;
        },
    },
};
</script>
  
<style>
.kpi-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 200px;
    height: 200px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #f8fafb;
}

.kpi-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.kpi-gauge {
    display: block;
    margin: 0 10px;
}

.kpi-date {
    font-size: 11px;
    justify-content: center;
    margin-top: 10px;
}

.kpi-gauge-background {
    fill: none;
    stroke: #ccc;
    stroke-width: 10;
    /* Adjust the thickness of the gauge here */
    transform-origin: center;
    transform: rotate(-90deg);
}

.kpi-gauge-progress {
    fill: none;
    stroke-width: 10;
    /* Adjust the thickness of the gauge here */
    transform-origin: center;
    transform: rotate(-90deg);
}

.kpi-values {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    width: 100%;
}

.kpi-current,
.kpi-target {
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;
}

.kpi-gauge-container {
    position: relative;
}

.kpi-values {
    position: absolute;
    top: 40%;
    left: 75%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;
    z-index: 1;
    /* Ensures the text is above the gauge */
}
</style>
  