---
layout: default
title: Elevator Uplifts
permalink: /elevator-uplifts/
---

<div
  class="elevator-uplifts"
  data-count="{{ site.data.elevator_uplifts.count }}"
  data-prefix="{{ site.data.elevator_uplifts.prefix }}"
  data-ext="{{ site.data.elevator_uplifts.ext }}"
  data-pad="{{ site.data.elevator_uplifts.pad }}"
  data-dir="{{ site.data.elevator_uplifts.dir }}"
>
  <div class="elevator-uplifts-frame">
    <img
      class="elevator-uplifts-image"
      src="{{ site.data.elevator_uplifts.dir }}/{{ site.data.elevator_uplifts.prefix }}001.{{ site.data.elevator_uplifts.ext }}"
      alt="Elevator mood"
      loading="eager"
      decoding="async"
    >
  </div>
  <button class="elevator-uplifts-button" type="button" aria-label="Mood random">
    <img
      src="{{ '/assets/img/mood-random-button.png' | relative_url }}"
      alt="Mood random"
      loading="eager"
      decoding="async"
    >
  </button>
</div>
