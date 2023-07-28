<template>
    <div :id="'heatmap-container-' + id" class="heatmap-container" :style="containerStyle" ref="heatmapContainer">
        <!-- Render buttons based on the transformed interactions data -->
        <button v-for="(dataPoint, index) in transformedData" :key="index" class="heatmap-button"
            :style="buttonStyle(dataPoint)" disabled="true">
            {{ dataPoint.interaction }}
        </button>
    </div>
</template>
  
<script>
export default {
    props: {
        screenResolution: {
            type: String,
            required: true,
        },
        data: {
            type: Array,
            default: () => [],
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    computed: {
        containerStyle() {
            const [width, height] = this.screenResolution.split("x").map((val) => parseInt(val.trim()));
            const scaledWidth = width / 2;
            const scaledHeight = height / 2;
            return {
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                position: "relative",
                border: "1px solid #ccc",
            };
        },
        transformedData() {
            const maxInteraction = Math.max(...this.data.map((dataPoint) => dataPoint.count));
            const minInteraction = Math.min(...this.data.map((dataPoint) => dataPoint.count));
            const scalingFactor = 0.5;

            return this.data.map((dataPoint) => {
                const [x, y] = dataPoint.location.split("x").map((val) => parseFloat(val.trim()));
                const scaledX = (x / this.originalWidth) * this.containerWidth;
                const scaledY = (y / this.originalHeight) * this.containerHeight;

                return { location: { x: scaledX, y: scaledY }, interaction: dataPoint.count };
            });
        },
        originalWidth() {
            return parseInt(this.screenResolution.split("x")[0].trim());
        },
        originalHeight() {
            return parseInt(this.screenResolution.split("x")[1].trim());
        },
        containerWidth() {
            return this.originalWidth / 2;
        },
        containerHeight() {
            return this.originalHeight / 2;
        },
    },
    methods: {
        buttonStyle(dataPoint) {
            const buttonSize = 20;
            const color = this.getColor(dataPoint.interaction);
            return {
                position: "absolute",
                top: `${dataPoint.location.y}px`,
                left: `${dataPoint.location.x}px`,
                transform: "translate(-50%, -50%)",
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
                borderRadius: "50%",
                background: color,
                color: "#fff",
                fontSize: "12px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
            };
        },
        getColor(interaction) {
            const maxInteraction = Math.max(...this.data.map((dataPoint) => dataPoint.count));
            const minInteraction = Math.min(...this.data.map((dataPoint) => dataPoint.count));

            if (interaction <= minInteraction) {
                return "#7BDCB5"; // Light green for the minimum interaction
            } else if (interaction <= maxInteraction) {
                const percentage = (interaction - minInteraction) / (maxInteraction - minInteraction);
                const r = Math.floor(124 + (255 - 124) * percentage);
                const g = Math.floor(220 + (215 - 220) * percentage);
                const b = Math.floor(181 + (71 - 181) * percentage);
                return `rgb(${r},${g},${b})`;
            } else {
                return "#FF6347"; // Tomato for the maximum interaction
            }
        },
    },
};
</script>
  
<style scoped>
.heatmap-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #faf8fb;
    overflow: hidden;
}

.heatmap-button {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
}
</style>
  