<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Counter Value</h2>
      <p class="text-6xl font-bold mb-4" :class="valueColorClass">
        {{ count }}
      </p>
      <p class="text-sm text-gray-600">Double: {{ doubleCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType, type ComputedRef } from 'vue';

/**
 * Counter display component
 * Follows Single Responsibility Principle - only displays counter value
 * Pure presentational component with no business logic
 */
export default defineComponent({
  name: 'CounterDisplay',

  props: {
    /**
     * Current counter value to display
     */
    count: {
      type: Number as PropType<number>,
      required: true,
    },

    /**
     * Double of the current counter value
     */
    doubleCount: {
      type: Number as PropType<number>,
      required: true,
    },

    /**
     * Whether the counter value is positive
     */
    isPositive: {
      type: Boolean as PropType<boolean>,
      default: false,
    },

    /**
     * Whether the counter value is negative
     */
    isNegative: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },

  /**
   *
   */
  setup(props) {
    /**
     * Computes the color class based on counter value
     */
    const valueColorClass: ComputedRef<string> = computed(() => {
      if (props.isPositive) {
        return 'text-green-600';
      }
      if (props.isNegative) {
        return 'text-red-600';
      }
      return 'text-gray-600';
    });

    return {
      valueColorClass,
    };
  },
});
</script>
