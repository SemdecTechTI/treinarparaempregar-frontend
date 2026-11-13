<template>
  <div ref="rootEl" class="vn2 overflow-x-clip bg-white">
    <div ref="progressBar" class="vn2-progress" aria-hidden="true" />

    <div class="relative">
    <!-- Hero -->
    <section ref="heroEl" class="vn2-hero overflow-hidden">
      <div class="vn2-skyline absolute inset-x-0 bottom-0 h-24 lg:h-36 opacity-60" />
      <div class="vn2-hero-inner container mx-auto px-4 relative grid lg:grid-cols-[1.2fr_1fr] gap-2 lg:gap-6 items-end lg:min-h-[calc(100svh-7rem)]">
        <div class="relative z-10 pt-7 sm:pt-10 pb-2 lg:py-20 self-center">
          <div class="vn2-in inline-flex items-center gap-3 rounded-full bg-white/70 backdrop-blur pl-1.5 pr-4 py-1.5 shadow-sm">
            <img src="/images/vida-nova/logo-prefeitura.webp" alt="" class="h-8 w-8" width="240" height="240">
            <span class="text-[13px] font-semibold text-vn-navy">Prefeitura de Salvador</span>
            <span class="w-px h-4 bg-vn-navy/20" />
            <img src="/images/vida-nova/logo-vida-nova.webp" alt="Vida Nova" class="h-5 w-auto" width="600" height="238">
          </div>
          <VidaNovaSplit
            tag="h1"
            class="vn2-h1 text-vn-navy mt-7"
            text="Uma vaga pode transformar uma família inteira."
            accent="transformar"
            accent-class="vn2-marker"
          />
          <p class="vn2-in text-[17px] sm:text-lg lg:text-xl text-vn-navy/80 font-normal mt-5 sm:mt-6 max-w-xl" style="animation-delay: 450ms">
            O Vida Nova acompanha cerca de 3,2 mil famílias de Salvador na superação da pobreza.
            Quando sua empresa abre uma vaga, o trabalho vira autonomia para uma pessoa e para toda a família.
          </p>
          <div class="vn2-in grid sm:flex sm:flex-wrap items-center gap-3 mt-8 sm:mt-9" style="animation-delay: 600ms">
            <NuxtLink v-magnetic to="/cadastre-sua-vaga" class="btn vn2-btn vn2-btn-blue justify-center">
              Cadastre sua vaga <span class="vn2-arrow" aria-hidden="true">→</span>
            </NuxtLink>
            <a href="#como-funciona" class="btn vn2-btn vn2-btn-ghost justify-center">Como funciona</a>
          </div>
          <p class="vn2-in hidden lg:flex items-center gap-3 mt-14 text-xs font-bold uppercase tracking-[0.2em] text-vn-navy/50" style="animation-delay: 900ms">
            <span class="vn2-mouse" aria-hidden="true" />
            Role para conhecer
          </p>
        </div>

        <div class="relative h-[23rem] sm:h-[30rem] lg:h-[min(37rem,calc(100svh-10rem))]" aria-hidden="true">
          <VidaNovaSmile class="vn2-draw absolute left-1/2 top-[7%] w-[94%] -translate-x-1/2 text-vn-pink" />
          <img
            src="/images/vida-nova/pessoa-2.webp"
            alt=""
            class="vn2-person absolute bottom-0 left-0 h-[80%] w-auto"
            style="animation-delay: 250ms"
            width="700"
            height="934"
            fetchpriority="high"
          >
          <img
            src="/images/vida-nova/pessoa-1.webp"
            alt=""
            class="vn2-person absolute bottom-0 -right-[4%] h-[90%] w-auto"
            style="animation-delay: 400ms"
            width="700"
            height="933"
            fetchpriority="high"
          >
          <div class="vn2-pop absolute left-0 sm:-left-[4%] top-0 sm:top-[22%] z-20" style="--d: 1100ms">
            <div class="vn2-bob vn2-ui-card">
              <span class="vn2-ui-icon bg-vn-blue text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16v11H4zM9 8V5.5h6V8M4 13h16" /></svg>
              </span>
              <span><strong>Vaga cadastrada</strong><small>Enviada para análise</small></span>
            </div>
          </div>
          <div class="vn2-pop absolute right-[2%] top-[2%] z-20 hidden sm:block" style="--d: 1500ms">
            <div class="vn2-bob vn2-ui-card">
              <span class="vn2-ui-icon bg-vn-yellow text-vn-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
              </span>
              <span><strong>Conexão via SIMM</strong><small>Talentos do Vida Nova</small></span>
            </div>
          </div>
          <div class="vn2-pop absolute left-0 sm:left-[4%] bottom-[5%] sm:bottom-[18%] z-20" style="--d: 1900ms">
            <div class="vn2-bob vn2-ui-card">
              <span class="vn2-ui-icon bg-vn-pink text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              <span><strong>Contratação</strong><small>Autonomia para a família</small></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Manifesto -->
    <section id="programa" ref="manifestoEl" class="vn2-manifesto relative z-10 -mt-8 lg:-mt-12 rounded-t-[2rem] lg:rounded-t-[3rem] bg-vn-navy text-white" :class="{ 'is-pinned': canPin }">
      <div class="vn2-manifesto-inner">
        <VidaNovaSmile class="absolute -right-16 bottom-10 w-72 lg:w-[30rem] text-white/[0.04]" data-vn-parallax="-0.15" />
        <div class="container mx-auto px-4 py-24 lg:py-0 relative">
          <p class="vn2-eyebrow text-vn-yellow">Vida Nova: a família no centro</p>
          <p class="vn2-manifesto-text mt-8 max-w-5xl">
            <span
              v-for="(w, i) in manifestoWords"
              :key="i"
              class="vn2-mw"
              :class="{ 'is-hl': w.hl }"
              :style="{ '--i': (i / manifestoWords.length).toFixed(3) }"
            >{{ w.text + ' ' }}</span>
          </p>
          <p class="flex items-center gap-4 mt-12 text-sm font-semibold text-white/50">
            <VidaNovaSmile class="w-10 text-vn-pink" />
            Programa Vida Nova · Prefeitura de Salvador
          </p>
        </div>
      </div>
    </section>
    </div>

    <!-- Números -->
    <section ref="bentoEl" class="py-24 lg:py-32">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-6 lg:gap-12 items-end">
          <RevealOnScroll>
            <p class="vn2-eyebrow text-vn-pink">O programa em números</p>
            <VidaNovaSplit class="vn2-h2 text-vn-navy mt-4" text="Políticas integradas, focadas em quem mais precisa." />
          </RevealOnScroll>
          <RevealOnScroll :delay="120">
            <p class="text-lg text-text font-normal lg:max-w-md lg:ml-auto">
              A superação da pobreza exige intervenções integradas: não apenas transferência de renda, mas acesso pleno
              a direitos, serviços públicos de qualidade e fortalecimento da autonomia das famílias.
            </p>
          </RevealOnScroll>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-14">
          <RevealOnScroll class="col-span-2 lg:row-span-2">
            <div class="vn2-curtain relative h-full min-h-[22rem] lg:min-h-[32rem] bg-vn-navy">
              <img
                src="/images/vida-nova/familia.webp"
                alt="Família soteropolitana atendida pelo programa"
                class="absolute inset-0 w-full h-full object-cover object-[70%_30%]"
                width="900"
                height="993"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-vn-navy via-vn-navy/25 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 p-7 lg:p-10 text-white">
                <p class="vn2-stat text-7xl lg:text-8xl">{{ fmt(0) }}<span class="text-3xl lg:text-5xl ml-2">mil</span></p>
                <p class="text-lg text-white/85 font-normal mt-3 max-w-xs">famílias selecionadas para o acompanhamento</p>
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll v-for="(t, i) in tiles" :key="t.label" :delay="(i % 2) * 110" :class="i % 2 ? 'vn2-pop-in is-r' : 'vn2-pop-in'">
            <div class="vn2-tile h-full" :class="t.tone">
              <p class="vn2-stat text-[2.75rem] sm:text-6xl lg:text-7xl whitespace-nowrap"><span v-if="t.prefix" class="text-xl sm:text-2xl lg:text-3xl mr-1">{{ t.prefix }}</span>{{ t.stat !== undefined ? fmt(t.stat) : t.value }}<span v-if="t.suffix" class="text-xl sm:text-2xl lg:text-3xl ml-1">{{ t.suffix }}</span></p>
              <p class="text-[13px] sm:text-base font-medium mt-5 sm:mt-6 leading-snug opacity-85">{{ t.label }}</p>
            </div>
          </RevealOnScroll>
        </div>

        <div class="grid md:grid-cols-3 gap-8 md:gap-6 mt-16">
          <RevealOnScroll v-for="(p, i) in pillars" :key="p.tag" :delay="i * 100">
            <div class="border-t-2 border-vn-navy pt-5">
              <p class="text-sm font-bold tracking-[0.2em] text-vn-pink">{{ p.tag }}</p>
              <p class="text-xl lg:text-2xl font-semibold text-vn-navy mt-2 leading-snug">{{ p.text }}</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>

    <!-- 6 dimensões -->
    <section class="relative overflow-hidden bg-vn-blue text-white py-24 lg:py-32">
      <div class="vn2-dots absolute inset-0 opacity-40" />
      <VidaNovaSmile class="absolute -top-12 right-4 lg:right-16 w-40 lg:w-64 text-vn-yellow rotate-6" data-vn-parallax="-0.2" />
      <div class="container mx-auto px-4 relative z-10">
        <RevealOnScroll>
          <p class="vn2-eyebrow text-vn-yellow">Visão geral</p>
          <VidaNovaSplit class="vn2-h2 text-white mt-4" text="6 dimensões da pobreza" accent="6 dimensões" accent-class="text-vn-yellow" />
          <p class="text-lg text-white/80 font-normal mt-5 max-w-xl">O estudo multidimensional é o primeiro passo para transformar realidades. Toque em cada dimensão.</p>
        </RevealOnScroll>
        <div class="mt-14 lg:mt-16">
          <VidaNovaOrbit :items="dimensions" />
        </div>
      </div>
    </section>

    <!-- IVS-Salvador -->
    <section class="bg-[#fffbe3] py-24 lg:py-32">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <RevealOnScroll>
            <p class="vn2-eyebrow text-vn-pink">Como as famílias são selecionadas</p>
            <VidaNovaSplit class="vn2-h2 text-vn-blue mt-4" text="IVS-Salvador" />
            <p class="text-xl lg:text-2xl font-semibold text-vn-navy mt-4">Seleção técnica, isenta e focada em quem mais precisa.</p>
          </RevealOnScroll>
          <ol class="relative space-y-7 lg:pt-3 before:absolute before:left-[1.35rem] before:top-3 before:bottom-3 before:w-px before:bg-vn-pink/30">
            <RevealOnScroll v-for="(s, i) in ivsSteps" :key="s.title" :delay="i * 120">
              <li class="relative flex gap-5">
                <span class="shrink-0 w-11 h-11 rounded-full bg-vn-pink text-white font-bold flex items-center justify-center ring-[6px] ring-[#fffbe3]">{{ i + 1 }}</span>
                <div>
                  <h3 class="text-lg font-bold text-vn-navy">{{ s.title }}</h3>
                  <p class="text-[15px] text-text font-normal mt-1">{{ s.text }}</p>
                </div>
              </li>
            </RevealOnScroll>
          </ol>
        </div>

        <div class="grid lg:grid-cols-[0.75fr_1.25fr] gap-4 mt-16">
          <RevealOnScroll>
            <div class="vn2-curtain h-full">
              <img
                src="/images/vida-nova/ivs.webp"
                alt="Equipe com o Manual do IVS Salvador"
                class="w-full h-full aspect-[5/4] lg:aspect-auto lg:min-h-[22rem] object-cover object-[50%_40%]"
                width="900"
                height="1090"
                loading="lazy"
              >
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div class="h-full rounded-[2rem] bg-white p-6 sm:p-8 lg:p-10 shadow-card">
              <p class="text-sm font-bold uppercase tracking-[0.16em] text-vn-navy">
                4 dimensões e 19 indicadores do CadÚnico
              </p>
              <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-y-8 mt-6 sm:mt-7">
                <div v-for="(g, gi) in ivsGroups" :key="g.title">
                  <div class="flex items-center sm:justify-between gap-2">
                    <h3 class="text-[15px] font-bold text-vn-navy">{{ g.title }}</h3>
                    <span class="text-xs font-bold rounded-full px-2 py-0.5" :class="g.badge">{{ g.items.length }}</span>
                  </div>
                  <ul class="mt-3 flex flex-wrap gap-1.5 lg:block lg:space-y-1.5">
                    <li
                      v-for="(item, ii) in g.items"
                      :key="item"
                      class="vn2-chip"
                      :class="g.chip"
                      :style="{ transitionDelay: `${300 + gi * 90 + ii * 60}ms` }"
                    >{{ item }}</li>
                  </ul>
                </div>
              </div>
              <svg class="vn2-funnel hidden lg:block w-full h-16 mt-4" viewBox="0 0 800 80" preserveAspectRatio="none" aria-hidden="true">
                <path v-for="(x, i) in [100, 300, 500, 700]" :key="x" :d="`M${x} 0 C${x} 45, 400 35, 400 80`" pathLength="1" fill="none" :stroke="['#003091', '#eb008c', '#e8b400', '#142541'][i]" stroke-width="2" />
              </svg>
              <div class="flex justify-center mt-4 lg:mt-0">
                <span class="vn2-index inline-flex items-center gap-3 rounded-full bg-vn-navy text-white pl-2 pr-5 py-2">
                  <span class="w-8 h-8 rounded-full bg-vn-yellow text-vn-navy flex items-center justify-center">
                    <VidaNovaSmile class="w-5" />
                  </span>
                  <span class="text-sm font-semibold">Somados e normalizados em <strong class="text-vn-yellow">um índice final</strong></span>
                </span>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>

    <!-- Etapas -->
    <section class="bg-[#f3f6fc] py-24 lg:py-32">
      <div class="container mx-auto px-4 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16">
        <div>
          <div class="lg:sticky lg:top-[calc(var(--vn-header)+3rem)]">
            <RevealOnScroll>
              <p class="vn2-eyebrow text-vn-pink">Passo a passo</p>
              <VidaNovaSplit class="vn2-h2 text-vn-navy mt-4" text="Etapas do programa" accent="Etapas" accent-class="text-vn-blue" />
              <p class="text-lg text-text font-normal mt-5 max-w-md">Acompanhamento estruturado das famílias participantes, da seleção à superação da pobreza.</p>
              <div class="flex gap-8 mt-10">
                <div>
                  <p class="vn2-stat text-5xl text-vn-blue">5</p>
                  <p class="text-sm text-text font-medium mt-1">etapas</p>
                </div>
                <div>
                  <p class="vn2-stat text-5xl text-vn-pink">2 anos</p>
                  <p class="text-sm text-text font-medium mt-1">de monitoramento</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
        <ol class="flex flex-col gap-6">
          <li
            v-for="(s, i) in stages"
            :key="s.title"
            ref="stageCards"
            class="sticky"
            :style="{ top: `calc(var(--vn-header) + ${24 + i * 18}px)` }"
          >
            <article class="vn2-stack-card rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-7 lg:p-10 min-h-[17rem] sm:min-h-[19rem] lg:min-h-[22rem] flex flex-col" :class="s.tone">
              <div class="flex items-start justify-between gap-6">
                <span class="vn2-stat text-5xl sm:text-6xl lg:text-7xl opacity-30">0{{ i + 1 }}</span>
                <span class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center" :class="s.iconTone">
                  <svg viewBox="0 0 24 24" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="s.icon" /></svg>
                </span>
              </div>
              <h3 class="text-[1.75rem] sm:text-3xl lg:text-4xl leading-tight font-bold text-inherit mt-auto pt-8 sm:pt-10">{{ s.title }}</h3>
              <p class="text-base sm:text-lg font-normal mt-2 sm:mt-3 opacity-80 max-w-lg">{{ s.text }}</p>
              <p class="self-start mt-5 sm:mt-6 rounded-2xl sm:rounded-full px-4 py-2 text-[13px] sm:text-sm font-semibold" :class="s.noteTone">{{ s.note }}</p>
            </article>
          </li>
        </ol>
      </div>
    </section>

    <!-- Jornada -->
    <section ref="journeyEl" class="relative overflow-hidden py-24 lg:py-32">
      <RevealOnScroll>
        <div class="container mx-auto px-4 text-center max-w-3xl">
          <p class="vn2-eyebrow text-vn-pink">Vida Nova | Inclusão produtiva</p>
          <VidaNovaSplit class="vn2-h2 text-vn-navy mt-4" text="Da proteção social à autonomia pelo trabalho" />
          <p class="text-lg text-text font-normal mt-5">O percurso do programa ganha força quando se conecta às oportunidades reais de trabalho e renda.</p>
        </div>
      </RevealOnScroll>
      <div class="mt-16 lg:mt-20 space-y-10 lg:space-y-8">
        <div v-for="(j, i) in journey" :key="j.word" :style="{ '--dir': i % 2 ? -1 : 1 }">
          <div class="vn2-row-track flex items-center gap-6 lg:gap-10 whitespace-nowrap" aria-hidden="true">
            <span class="vn2-word" :class="j.wordClass">{{ j.word }}</span>
            <VidaNovaSmile class="shrink-0 w-16 lg:w-32" :class="j.smileClass" />
            <span class="vn2-word" :class="j.wordClass">{{ j.word }}</span>
          </div>
          <div class="container mx-auto px-4 mt-4">
            <p class="flex gap-4 items-baseline max-w-xl" :class="i % 2 ? 'ml-auto' : ''">
              <span class="font-bold text-vn-pink">0{{ i + 1 }}</span>
              <span class="text-lg text-text font-normal"><strong class="font-semibold text-vn-navy capitalize">{{ j.word.toLowerCase() }}:</strong> {{ j.text }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Ponte -->
    <section ref="bridgeEl" class="relative overflow-hidden bg-vn-navy text-white py-24 lg:py-32">
      <div class="container mx-auto px-4">
        <RevealOnScroll>
          <div class="max-w-3xl">
            <p class="vn2-eyebrow text-vn-yellow">Uma ponte entre talentos e oportunidades</p>
            <VidaNovaSplit class="vn2-h2 text-white mt-4" text="A Prefeitura conecta pessoas e empresas" />
            <p class="text-lg text-white/75 font-normal mt-5">Uma atuação articulada para aproximar os participantes do Vida Nova das necessidades do mercado.</p>
          </div>
        </RevealOnScroll>
        <div class="relative mt-20">
          <div class="vn2-track-x hidden lg:block" aria-hidden="true"><span /></div>
          <div class="vn2-track-y lg:hidden" aria-hidden="true"><span /></div>
          <ol class="relative grid gap-12 lg:grid-cols-4 lg:gap-6">
            <li
              v-for="(b, i) in bridge"
              :key="b.title"
              class="flex lg:flex-col items-start lg:items-center gap-5 lg:text-center transition-opacity duration-500"
              :class="i <= activeBridge ? 'opacity-100' : 'opacity-40'"
            >
              <span
                class="relative shrink-0 w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center ring-8 ring-vn-navy transition-all duration-500"
                :class="bridgeNodeClass(i)"
              >
                <svg viewBox="0 0 24 24" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="b.icon" /></svg>
                <span
                  v-if="i === bridge.length - 1"
                  class="hidden lg:block absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-vn-yellow text-vn-navy text-xs font-bold px-3 py-1"
                >Sua empresa</span>
              </span>
              <div>
                <span v-if="i === bridge.length - 1" class="lg:hidden inline-block mb-2 rounded-full bg-vn-yellow text-vn-navy text-xs font-bold px-3 py-1">Sua empresa</span>
                <h3 class="text-xl font-bold" :class="i === bridge.length - 1 ? 'text-vn-pink' : 'text-vn-yellow'">{{ b.title }}</h3>
                <p class="text-white/75 font-normal mt-1.5">{{ b.text }}</p>
              </div>
            </li>
          </ol>
        </div>
        <RevealOnScroll>
          <p class="mt-20 text-2xl lg:text-4xl font-bold leading-tight max-w-4xl">
            O SIMM é a <span class="text-vn-yellow">porta de conexão</span> entre as demandas de contratação e os trabalhadores cadastrados.
          </p>
        </RevealOnScroll>
      </div>
    </section>

    <!-- Empresas -->
    <section id="como-funciona" class="scroll-mt-20 py-24 lg:py-32">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-6 lg:gap-12 items-end">
          <RevealOnScroll>
            <p class="vn2-eyebrow text-vn-pink">Convite ao setor empresarial</p>
            <VidaNovaSplit class="vn2-h2 text-vn-navy mt-4" text="Empresas são parceiras da inclusão produtiva" />
          </RevealOnScroll>
          <RevealOnScroll :delay="120">
            <p class="text-lg text-text font-normal lg:max-w-md lg:ml-auto">
              O RH tem um papel decisivo para transformar oportunidades em trajetórias profissionais.
            </p>
          </RevealOnScroll>
        </div>

        <div ref="actionsTrack" class="vn2-snap flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-14 -mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-px-4" @scroll.passive="onActionsScroll">
          <RevealOnScroll v-for="(a, i) in actions" :key="a.title" :delay="i * 90" class="shrink-0 w-[78%] sm:w-[45%] lg:w-auto snap-start">
            <div v-spotlight class="vn2-spot group relative h-full overflow-hidden rounded-[1.75rem] border border-vn-navy/10 bg-white p-7" :class="i % 2 ? 'max-lg:bg-[#fffbe3]' : 'max-lg:bg-[#f3f6fc]'">
              <span class="relative text-sm font-bold text-vn-pink">0{{ i + 1 }}</span>
              <h3 class="relative text-xl font-bold text-vn-navy mt-8 lg:mt-10">{{ a.title }}</h3>
              <p class="relative text-[15px] text-text font-normal mt-2">{{ a.text }}</p>
              <VidaNovaSmile class="absolute -right-4 -bottom-3 w-24 text-vn-yellow opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0" />
            </div>
          </RevealOnScroll>
        </div>
        <div class="lg:hidden flex items-center gap-4 mt-5" aria-hidden="true">
          <span class="relative flex-1 h-1 rounded-full bg-vn-navy/10 overflow-hidden">
            <span class="absolute inset-y-0 left-0 rounded-full bg-vn-pink transition-[width] duration-200" :style="{ width: `${actionsProgress * 100}%` }" />
          </span>
          <span class="text-xs font-bold uppercase tracking-[0.16em] text-vn-navy/50">Deslize</span>
        </div>

        <RevealOnScroll>
          <div class="relative mt-8 lg:mt-4 overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] bg-vn-blue text-white p-8 sm:p-10 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div class="vn2-dots absolute inset-0 opacity-30" />
            <blockquote class="relative">
              <VidaNovaSmile class="w-16 text-vn-yellow" />
              <p class="text-2xl sm:text-[1.875rem] lg:text-[2.6rem] font-bold leading-tight mt-8">
                Uma contratação pode representar autonomia para uma pessoa e
                <span class="text-vn-yellow">transformação para toda uma família.</span>
              </p>
              <footer class="text-xs font-semibold tracking-[0.18em] uppercase text-white/55 mt-8">Prefeitura de Salvador • Programa Vida Nova</footer>
            </blockquote>
            <div class="relative">
              <p class="vn2-eyebrow text-vn-yellow">Como sua empresa participa</p>
              <ol class="mt-8 space-y-7">
                <li v-for="(c, i) in companySteps" :key="c.title" class="relative flex gap-5">
                  <span class="shrink-0 w-11 h-11 rounded-full bg-vn-yellow text-vn-navy font-bold flex items-center justify-center">{{ i + 1 }}</span>
                  <div>
                    <h3 class="text-lg font-bold text-white">{{ c.title }}</h3>
                    <p class="text-white/75 font-normal mt-1">{{ c.text }}</p>
                  </div>
                </li>
              </ol>
              <NuxtLink v-magnetic to="/cadastre-sua-vaga" class="btn vn2-btn vn2-btn-yellow mt-10">
                Cadastre sua vaga <span class="vn2-arrow" aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="bg-[#fffbe3] py-24 lg:py-32">
      <div class="container mx-auto px-4 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
        <RevealOnScroll>
          <p class="vn2-eyebrow text-vn-pink">Perguntas frequentes</p>
          <VidaNovaSplit class="vn2-h2 text-vn-navy mt-4" text="Ficou com alguma dúvida?" />
          <p class="text-lg text-text font-normal mt-5 max-w-sm">O que sua empresa precisa saber para participar do Vida Nova.</p>
          <div class="mt-10 hidden lg:block">
            <p class="text-sm text-muted font-normal">Alinhado aos Objetivos de Desenvolvimento Sustentável</p>
            <img src="/images/vida-nova/ods.webp" alt="ODS 1, 8, 10 e 17" class="h-16 w-auto mt-3 rounded" width="900" height="237" loading="lazy">
          </div>
        </RevealOnScroll>
        <RevealOnScroll>
          <div class="divide-y divide-vn-navy/10 border-y border-vn-navy/10">
            <div v-for="(f, i) in faqs" :key="f.q">
              <h3>
                <button
                  type="button"
                  class="group w-full flex items-center justify-between gap-6 py-6 text-left"
                  :aria-expanded="openFaq === i"
                  :aria-controls="`vn2-faq-${i}`"
                  @click="openFaq = openFaq === i ? -1 : i"
                >
                  <span class="text-lg lg:text-xl font-semibold text-vn-navy group-hover:text-vn-blue transition-colors">{{ f.q }}</span>
                  <span
                    class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    :class="openFaq === i ? 'bg-vn-pink text-white rotate-45' : 'bg-white text-vn-navy shadow-sm'"
                  >
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
              </h3>
              <div :id="`vn2-faq-${i}`" class="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" :class="openFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
                <div class="overflow-hidden">
                  <p class="pb-7 pr-4 sm:pr-14 text-text font-normal text-[17px] leading-relaxed">{{ f.a }}</p>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>

    <!-- CTA final -->
    <section ref="finalEl" class="vn2-final bg-[#fffbe3]">
      <div class="vn2-final-panel relative overflow-hidden bg-vn-yellow">
        <div class="vn2-skyline absolute inset-x-0 bottom-0 h-28 lg:h-40 opacity-70" />
        <VidaNovaSmile class="absolute -top-10 -left-12 w-48 lg:w-80 text-vn-pink" data-vn-parallax="0.12" />
        <VidaNovaSmile class="absolute top-16 -right-10 w-28 lg:w-44 text-vn-blue -rotate-12" data-vn-parallax="-0.1" />
        <div class="container mx-auto px-4 relative z-10 py-24 lg:py-36 text-center">
          <RevealOnScroll>
            <p class="vn2-eyebrow text-vn-navy before:hidden sm:before:block">Sua empresa pode fazer parte dessa transformação</p>
            <p class="vn2-eq mt-10">
              <span v-for="(t, i) in equation" :key="i" :class="{ 'text-vn-pink': t.op }" :style="{ transitionDelay: `${i * 110}ms` }">{{ t.text }}</span>
            </p>
            <p class="mt-3 lg:mt-5"><span class="vn2-result">inclusão produtiva</span></p>
            <div class="flex flex-wrap justify-center gap-3 mt-14">
              <NuxtLink v-magnetic to="/cadastre-sua-vaga" class="btn vn2-btn vn2-btn-blue vn2-btn-lg">
                Cadastre sua vaga <span class="vn2-arrow" aria-hidden="true">→</span>
              </NuxtLink>
            </div>
            <p class="text-sm text-vn-navy/60 font-medium mt-5">Disponibilize vagas e compartilhe suas demandas com o SIMM.</p>
          </RevealOnScroll>
        </div>
      </div>
    </section>

    <Transition name="vn2-float">
      <NuxtLink v-if="showFloat" to="/cadastre-sua-vaga" class="btn vn2-floating">
        <VidaNovaSmile class="w-6 text-vn-yellow" />
        Cadastre sua vaga
      </NuxtLink>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Directive } from 'vue'

usePageSeo({
  title: 'Programa Vida Nova',
  description: 'Vida Nova: a estratégia da Prefeitura de Salvador para a superação da pobreza. Cadastre vagas e faça parte da inclusão produtiva das famílias participantes.',
  path: '/programa/vida-nova',
})

const MANIFESTO = 'Uma estratégia real de *superação da pobreza* e de acolhimento das *famílias mais vulneráveis* da cidade.'

let inHighlight = false
const manifestoWords = MANIFESTO.split(' ').map((raw) => {
  if (raw.startsWith('*')) inHighlight = true
  const word = { text: raw.replace(/\*/g, ''), hl: inHighlight }
  if (raw.replace(/[.,]$/, '').endsWith('*')) inHighlight = false
  return word
})

const stats = [
  { num: 3.2, decimals: 1 },
  { num: 6, decimals: 0 },
  { num: 19, decimals: 0 },
  { num: 2, decimals: 0 },
]

const tiles: { stat?: number; value?: string; prefix?: string; suffix?: string; label: string; tone: string }[] = [
  { stat: 1, label: 'dimensões da pobreza trabalhadas de forma integrada', tone: 'bg-vn-yellow text-vn-navy' },
  { stat: 2, label: 'indicadores do CadÚnico no IVS-Salvador', tone: 'bg-vn-blue text-white' },
  { stat: 3, suffix: 'anos', label: 'de monitoramento de cada família', tone: 'bg-vn-pink text-white' },
  { prefix: 'R$', value: '218', label: 'renda per capita que define a pobreza pelo MDS', tone: 'bg-white text-vn-navy border border-vn-navy/10' },
]

const pillars = [
  { tag: 'ENTENDE', text: 'as necessidades das famílias soteropolitanas' },
  { tag: 'CRIA', text: 'políticas públicas integradas e customizadas' },
  { tag: 'GARANTE', text: 'empoderamento, direitos e estratégias de saída da vulnerabilidade social' },
]

const dimensions = [
  {
    title: 'Assistência Social',
    text: 'Estado de desproteção social associado à fragilidade dos vínculos comunitários, à violação de direitos e à exclusão de mecanismos formais de cidadania.',
    icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 2.7-5 6-5s6 2 6 5M16 5.2a3 3 0 0 1 0 5.6M18 14.3c1.8.7 3 2.3 3 4.7',
  },
  {
    title: 'Saúde',
    text: 'Acesso limitado a serviços de saúde e carência de saneamento, comprometendo a qualidade de vida de indivíduos e famílias.',
    icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10zM8 11h2l1-2 2 4 1-2h2',
  },
  {
    title: 'Educação',
    text: 'Baixa escolarização, defasagem idade-série, evasão escolar e acesso precário à educação infantil, fundamental ou qualificação profissional.',
    icon: 'M2 9l10-5 10 5-10 5-10-5zM6 11.5V16c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-4.5M22 9v5',
  },
  {
    title: 'Habitação',
    text: 'Privação do direito a uma moradia digna, segura e com infraestrutura essencial, comprometendo a saúde, a segurança e a convivência familiar.',
    icon: 'M4 11l8-7 8 7M6 10v9h12v-9M10 19v-5h4v5',
  },
  {
    title: 'Segurança Alimentar',
    text: 'Condição de estabilidade no acesso a alimentos seguros e permanentes durante todo o ano, em quantidade e qualidade, para uma vida ativa e saudável.',
    icon: 'M4 12h16a8 8 0 0 1-16 0zM9 8c0-1.5 1-1.5 1-3M14 8c0-1.5 1-1.5 1-3',
  },
  {
    title: 'Emprego e Renda',
    text: 'Geração de trabalho e renda estável, com melhores oportunidades, direitos e apoio, é essencial para as condições de superar a barreira da fome.',
    icon: 'M4 8h16v11H4zM9 8V5.5h6V8M4 13h16',
    highlight: true,
  },
]

const ivsSteps = [
  { title: 'O desafio', text: 'Selecionar as famílias de forma técnica e isenta, com mais assertividade.' },
  { title: 'A inspiração', text: 'Nos inspiramos no IVF do Paraná, mas precisávamos de algo customizado a Salvador.' },
  { title: 'A criação', text: 'A Prefeitura de Salvador desenvolveu o próprio índice, o IVS-Salvador, através da SEMPRE, com apoio da FMLF.' },
]

const ivsGroups = [
  {
    title: 'Moradia',
    badge: 'bg-vn-blue text-white',
    chip: 'bg-[#eaf0fb] text-vn-navy',
    items: ['Espécie de domicílio', 'Densidade por dormitório', 'Paredes do domicílio', 'Piso do domicílio', 'Água encanada', 'Esgotamento sanitário', 'Coleta de lixo'],
  },
  {
    title: 'Perfil Familiar',
    badge: 'bg-vn-pink text-white',
    chip: 'bg-[#fde7f3] text-vn-navy',
    items: ['Responsabilidade pela família', 'Razão de dependência de crianças e adolescentes', 'Crianças de 0 a 6 anos', 'Pessoas com deficiência na família', 'Idosos em condição de agregado'],
  },
  {
    title: 'Trabalho e Renda',
    badge: 'bg-vn-yellow text-vn-navy',
    chip: 'bg-[#fff6c7] text-vn-navy',
    items: ['Trabalho dos adultos', 'Renda familiar mensal per capita', 'Recebimento de benefícios federais'],
  },
  {
    title: 'Educação',
    badge: 'bg-vn-navy text-white',
    chip: 'bg-[#e9ecf2] text-vn-navy',
    items: ['Crianças e adolescentes fora da escola', 'Distorção idade-série', 'Jovens e adultos sem ensino fundamental', 'Analfabetismo do chefe de família'],
  },
]

const stages = [
  {
    title: 'Seleção',
    text: 'Seleção das famílias e aplicação do IVS-Salvador.',
    note: 'Definição das cerca de 3,2 mil famílias',
    icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 2.7-5 6-5s6 2 6 5M16 5.2a3 3 0 0 1 0 5.6M18 14.3c1.8.7 3 2.3 3 4.7',
    tone: 'bg-white text-vn-navy border border-vn-navy/10 shadow-card',
    iconTone: 'bg-vn-pink text-white',
    noteTone: 'bg-vn-yellow text-vn-navy',
  },
  {
    title: 'Triagem',
    text: 'Triagem in loco e assinatura do termo de compromisso.',
    note: 'Validação final das famílias',
    icon: 'M9 4h6v3H9zM7 5.5H5.5V21h13V5.5H17M8.5 13l2 2 4-4',
    tone: 'bg-vn-yellow text-vn-navy',
    iconTone: 'bg-vn-navy text-vn-yellow',
    noteTone: 'bg-white text-vn-navy',
  },
  {
    title: 'Diagnóstico',
    text: 'Diagnóstico técnico social de cada família.',
    note: 'Estratégia de Ação Familiar no CRAS, com atuação de toda a Prefeitura',
    icon: 'M4 11l8-7 8 7M6 10v10h12V10M12 17s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8C15 15.2 12 17 12 17z',
    tone: 'bg-vn-blue text-white',
    iconTone: 'bg-vn-yellow text-vn-navy',
    noteTone: 'bg-white/15 text-white',
  },
  {
    title: 'Monitoramento',
    text: 'Monitoramento familiar durante 2 anos.',
    note: 'Articulação das ações com a família',
    icon: 'M4 5h16v11H9l-5 4zM8 10h8M8 13h5',
    tone: 'bg-vn-navy text-white',
    iconTone: 'bg-vn-pink text-white',
    noteTone: 'bg-vn-yellow text-vn-navy',
  },
  {
    title: 'Superação da Pobreza',
    text: 'Família com a superação da pobreza e novas oportunidades.',
    note: 'Avaliação dos resultados',
    icon: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
    tone: 'bg-vn-pink text-white',
    iconTone: 'bg-white text-vn-pink',
    noteTone: 'bg-vn-navy text-white',
  },
]

const journey = [
  { word: 'DESENVOLVER', text: 'acolher, identificar potencialidades e fortalecer competências.', wordClass: 'text-vn-navy', smileClass: 'text-vn-yellow' },
  { word: 'PREPARAR', text: 'qualificar e aproximar os participantes do mundo do trabalho.', wordClass: 'vn2-outline', smileClass: 'text-vn-pink' },
  { word: 'CONECTAR', text: 'articular oportunidades de emprego, empreendedorismo e geração de renda.', wordClass: 'text-vn-pink', smileClass: 'text-vn-blue' },
]

const bridge = [
  { title: 'Vida Nova', text: 'Desenvolvimento e preparação dos participantes.', icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z' },
  { title: 'Prefeitura', text: 'Articulação das políticas públicas e dos serviços.', icon: 'M4 20h16M6 20v-9M10 20v-9M14 20v-9M18 20v-9M3 10l9-6 9 6z' },
  { title: 'SEMDEC + SIMM', text: 'Captação de vagas, cadastro e intermediação.', icon: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1' },
  { title: 'Empresas + RH', text: 'Oportunidades, processos seletivos e contratação.', icon: 'M4 8h16v11H4zM9 8V5.5h6V8M4 13h16' },
]

const actions = [
  { title: 'Abrir vagas', text: 'Compartilhar oportunidades e demandas de contratação.' },
  { title: 'Ampliar o acesso', text: 'Considerar competências, potencial e trajetórias diversas.' },
  { title: 'Aproximar', text: 'Participar de feiras, seleções, visitas e ações de empregabilidade.' },
  { title: 'Desenvolver', text: 'Oferecer aprendizagem, estágio e oportunidades de crescimento.' },
]

const companySteps = [
  { title: 'Cadastre a vaga', text: 'Informe o CNPJ da empresa e os dados da oportunidade no formulário.' },
  { title: 'Análise da equipe', text: 'A vaga passa por análise interna e, após aprovação, é divulgada.' },
  { title: 'Intermediação do SIMM', text: 'O SIMM conecta sua demanda aos trabalhadores cadastrados, e sua empresa conduz a seleção e a contratação.' },
]

const faqs = [
  {
    q: 'O que é o Programa Vida Nova?',
    a: 'É a estratégia da Prefeitura de Salvador para a superação da pobreza e o acolhimento das famílias mais vulneráveis da cidade. O programa entende as necessidades das famílias, cria políticas públicas integradas e garante caminhos de saída da vulnerabilidade social.',
  },
  {
    q: 'Como as famílias participantes são selecionadas?',
    a: 'Pelo IVS-Salvador, índice criado pela Prefeitura através da SEMPRE, com apoio da FMLF. Ele reúne 19 indicadores do CadÚnico em 4 dimensões (moradia, perfil familiar, trabalho e renda, e educação) para uma seleção técnica e isenta.',
  },
  {
    q: 'Como funciona o acompanhamento das famílias?',
    a: 'As famílias passam por seleção, triagem e diagnóstico técnico social, com uma Estratégia de Ação Familiar no CRAS e atuação de toda a Prefeitura. O monitoramento dura 2 anos, até a avaliação dos resultados.',
  },
  {
    q: 'Como minha empresa pode participar?',
    a: 'Abrindo vagas, ampliando o acesso a trajetórias diversas, participando de feiras, seleções e ações de empregabilidade, e oferecendo aprendizagem, estágio e oportunidades de crescimento. O primeiro passo é cadastrar sua vaga.',
  },
  {
    q: 'Qual é o papel do SIMM?',
    a: 'O SIMM é a porta de conexão entre as demandas de contratação e os trabalhadores cadastrados. Junto com a SEMDEC, faz a captação de vagas, o cadastro e a intermediação.',
  },
]

const equation = [
  { text: 'Talentos' },
  { text: '+', op: true },
  { text: 'oportunidades' },
  { text: '+', op: true },
  { text: 'parceria' },
  { text: '=', op: true },
]

const rootEl = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)
const heroEl = ref<HTMLElement | null>(null)
const manifestoEl = ref<HTMLElement | null>(null)
const bentoEl = ref<HTMLElement | null>(null)
const stageCards = ref<HTMLElement[]>([])
const journeyEl = ref<HTMLElement | null>(null)
const bridgeEl = ref<HTMLElement | null>(null)
const finalEl = ref<HTMLElement | null>(null)
const actionsTrack = ref<HTMLElement | null>(null)

const canPin = ref(false)
const actionsProgress = ref(0)
const activeBridge = ref(bridge.length - 1)
const statProgress = ref(1)
const showFloat = ref(false)
const openFaq = ref(0)

function fmt(i: number) {
  const s = stats[i]
  return (s.num * statProgress.value).toLocaleString('pt-BR', {
    minimumFractionDigits: s.decimals,
    maximumFractionDigits: s.decimals,
  })
}

function onActionsScroll() {
  const el = actionsTrack.value
  if (el) actionsProgress.value = (el.scrollLeft + el.clientWidth) / el.scrollWidth
}

function bridgeNodeClass(i: number) {
  if (i > activeBridge.value) return 'bg-white/10 text-white/60'
  return i === bridge.length - 1 ? 'bg-vn-pink text-white scale-110' : 'bg-vn-yellow text-vn-navy'
}

const finePointer = () => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const vMagnetic: Directive<HTMLElement> = {
  mounted(el) {
    if (!finePointer()) return
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.22}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`
    })
    el.addEventListener('pointerleave', () => {
      el.style.translate = ''
    })
  },
}

const vSpotlight: Directive<HTMLElement> = {
  mounted(el) {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    })
  },
}

const clamp = (n: number) => Math.min(1, Math.max(0, n))
let raf = 0
let headerH = 0
let parallaxEls: HTMLElement[] = []

function update() {
  raf = 0
  const vh = window.innerHeight
  const doc = document.documentElement

  if (progressBar.value) {
    progressBar.value.style.transform = `scaleX(${clamp(window.scrollY / (doc.scrollHeight - vh)).toFixed(4)})`
  }

  if (manifestoEl.value) {
    const r = manifestoEl.value.getBoundingClientRect()
    heroEl.value?.style.setProperty('--hp', clamp((vh - r.top) / vh).toFixed(3))
    const p = canPin.value
      ? (headerH - r.top) / (r.height - (vh - headerH)) * 1.2
      : (vh * 0.85 - r.top) / (r.height * 0.8)
    manifestoEl.value.style.setProperty('--p', p.toFixed(3))
  }

  if (journeyEl.value) {
    const r = journeyEl.value.getBoundingClientRect()
    journeyEl.value.style.setProperty('--j', clamp((vh - r.top) / (vh + r.height)).toFixed(4))
  }

  if (bridgeEl.value) {
    const r = bridgeEl.value.getBoundingClientRect()
    const b = clamp((vh * 0.8 - r.top) / (r.height * 0.6))
    bridgeEl.value.style.setProperty('--b', b.toFixed(3))
    activeBridge.value = Math.min(bridge.length - 1, Math.floor(b * (bridge.length - 1) + 0.03))
  }

  const cards = stageCards.value
  for (let i = 0; i < cards.length - 1; i++) {
    const top = cards[i].getBoundingClientRect().top
    const next = cards[i + 1].getBoundingClientRect().top
    cards[i].style.setProperty('--c', clamp(1 - (next - top) / cards[i].offsetHeight).toFixed(3))
  }

  if (finalEl.value) {
    const r = finalEl.value.getBoundingClientRect()
    finalEl.value.style.setProperty('--cp', clamp((vh - r.top) / (vh * 0.7)).toFixed(3))
    const introTop = manifestoEl.value?.getBoundingClientRect().top ?? 0
    showFloat.value = introTop < vh * 0.4 && r.top > vh * 0.85
  }

  for (const el of parallaxEls) {
    const r = el.parentElement!.getBoundingClientRect()
    el.style.setProperty('--py', `${((r.top + r.height / 2 - vh / 2) * Number(el.dataset.vnParallax)).toFixed(1)}px`)
  }
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(update)
}

function countUp() {
  const start = performance.now()
  const tick = (now: number) => {
    const t = clamp((now - start) / 1600)
    statProgress.value = 1 - (1 - t) ** 3
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  const header = document.querySelector<HTMLElement>('header.sticky')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onResize = () => {
    headerH = header?.offsetHeight ?? 0
    rootEl.value?.style.setProperty('--vn-header', `${headerH}px`)
    canPin.value = !reduced && window.innerHeight >= 600
    // Hero fica preso pelo rodapé enquanto o manifesto sobe por cima
    if (heroEl.value) heroEl.value.style.top = `${Math.min(headerH, window.innerHeight - heroEl.value.offsetHeight)}px`
    onActionsScroll()
    onScroll()
  }

  if (reduced) {
    onResize()
    return
  }

  parallaxEls = [...rootEl.value!.querySelectorAll<HTMLElement>('[data-vn-parallax]')]
  onResize()

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    io.disconnect()
    countUp()
  }, { threshold: 0.25 })
  if (bentoEl.value && bentoEl.value.getBoundingClientRect().top > window.innerHeight) {
    statProgress.value = 0
    io.observe(bentoEl.value)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  onUnmounted(() => {
    io.disconnect()
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  })
})
</script>

<style scoped>
.vn2 {
  --vn-header: 72px;
}

.vn2-progress {
  @apply fixed top-0 inset-x-0 h-[3px] z-[60] pointer-events-none;
  background: linear-gradient(90deg, #eb008c, #fddd2a);
  transform: scaleX(0);
  transform-origin: 0 50%;
}

.vn2-eyebrow {
  @apply inline-flex items-center gap-2.5 text-xs lg:text-[13px] font-bold uppercase tracking-[0.2em];
}

.vn2-eyebrow::before {
  content: '';
  @apply w-6 h-[3px] rounded-full bg-current;
}

.vn2-h1 {
  @apply font-bold text-[2.75rem] leading-[1.04] tracking-[-0.03em] sm:text-[3.75rem] lg:text-[3.6rem] xl:text-[4.25rem];
}

.vn2-h2 {
  @apply font-bold text-[2.2rem] leading-[1.08] tracking-[-0.025em] sm:text-[3rem] lg:text-[3.5rem];
}

.vn2-stat {
  @apply font-bold leading-none tracking-[-0.03em] tabular-nums;
}

/* Botões */
.vn2 .vn2-btn {
  @apply rounded-full px-7 py-4 text-base font-bold tracking-normal;
  transition: translate 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.vn2 .vn2-btn-lg {
  @apply px-10 py-5 text-lg;
}

.vn2 .vn2-btn-blue,
.vn2 .vn2-btn-blue:hover {
  @apply bg-vn-blue text-white;
  box-shadow: 0 14px 30px -12px rgba(0, 48, 145, 0.65);
}

.vn2 .vn2-btn-yellow,
.vn2 .vn2-btn-yellow:hover {
  @apply bg-vn-yellow text-vn-navy;
  box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
}

.vn2 .vn2-btn-ghost,
.vn2 .vn2-btn-ghost:hover {
  @apply bg-white/60 text-vn-navy border border-vn-navy/15 shadow-none;
}

.vn2 .vn2-btn-ghost:hover {
  @apply bg-white;
}

.vn2 .vn2-btn:active {
  transform: scale(0.97);
}

.vn2-arrow {
  @apply inline-block transition-transform duration-300;
}

.vn2-btn:hover .vn2-arrow {
  @apply translate-x-1.5;
}

/* Hero */
.vn2-hero {
  @apply sticky;
  background: radial-gradient(55% 65% at 78% 45%, #fff2a8 0%, rgba(255, 242, 168, 0) 70%), #fddd2a;
}

.vn2-hero-inner {
  opacity: calc(1 - var(--hp, 0) * 0.85);
  transform: translateY(calc(var(--hp, 0) * -48px)) scale(calc(1 - var(--hp, 0) * 0.07));
  transform-origin: 50% 100%;
  will-change: transform, opacity;
}

.vn2 :deep(.vn2-marker) {
  @apply px-[0.14em] text-vn-navy;
  background: linear-gradient(#eb008c, #eb008c) no-repeat 0 55% / 0% 80%;
  transition: background-size 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.75s, color 0.4s ease 0.95s;
}

.vn2 :deep(.vn-split.visible .vn2-marker) {
  @apply text-white;
  background-size: 100% 80%;
}

.vn2-in {
  animation: vn2-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.vn2-person {
  animation: vn2-person 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.vn2-draw :deep(path) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: vn2-draw 1.8s cubic-bezier(0.65, 0, 0.35, 1) 0.3s forwards;
}

.vn2-pop {
  animation: vn2-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: var(--d, 0ms);
}

.vn2-bob {
  animation: vn2-bob 5s ease-in-out infinite;
  animation-delay: calc(var(--d, 0ms) + 0.8s);
}

.vn2-ui-card {
  @apply flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur pl-2.5 pr-4 py-2.5 text-left;
  box-shadow: 0 20px 40px -18px rgba(20, 37, 65, 0.5);
}

.vn2-ui-card strong {
  @apply block text-[13px] sm:text-sm font-semibold text-vn-navy leading-tight;
}

.vn2-ui-card small {
  @apply block text-[11px] sm:text-xs text-vn-navy/60 font-medium mt-0.5;
}

.vn2-ui-icon {
  @apply w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0;
}

.vn2-ui-icon svg {
  @apply w-5 h-5;
}

.vn2-mouse {
  @apply relative block w-5 h-8 rounded-full border-2 border-current;
}

.vn2-mouse::after {
  content: '';
  @apply absolute left-1/2 top-1.5 w-1 h-1.5 -ml-0.5 rounded-full bg-current;
  animation: vn2-wheel 1.8s ease-in-out infinite;
}

.vn2-skyline {
  background: url('/images/vida-nova/skyline.webp') repeat-x bottom / auto 100%;
  mix-blend-mode: multiply;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 45%);
  mask-image: linear-gradient(to bottom, transparent, #000 45%);
}

/* Manifesto */
.vn2-manifesto.is-pinned {
  height: 180vh;
}

@media (min-width: 1024px) {
  .vn2-manifesto.is-pinned {
    height: 220vh;
  }
}

.vn2-manifesto.is-pinned .vn2-manifesto-inner {
  @apply sticky flex items-center;
  top: var(--vn-header);
  height: calc(100vh - var(--vn-header));
}

.vn2-manifesto-text {
  @apply font-bold text-[2rem] leading-[1.18] tracking-[-0.02em] sm:text-[3rem] lg:text-[3.9rem];
}

.vn2-mw {
  opacity: clamp(0.14, calc((var(--p, 1) - var(--i)) * 10 + 0.14), 1);
  transition: opacity 0.2s linear;
}

.vn2-mw.is-hl {
  @apply text-vn-yellow;
}

/* Números */
.vn2-tile {
  @apply rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-7 min-h-[12rem] lg:min-h-0 flex flex-col justify-between transition-transform duration-500;
}

.vn2-tile:hover {
  transform: translateY(-4px) rotate(-0.6deg);
}

/* IVS */
.vn2-chip {
  @apply rounded-lg px-2.5 py-1.5 text-[13px] leading-snug font-medium;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.visible .vn2-chip {
  opacity: 1;
  transform: none;
}

.vn2-funnel path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1.3s cubic-bezier(0.65, 0, 0.35, 1) 1.2s;
}

.visible .vn2-funnel path {
  stroke-dashoffset: 0;
}

.vn2-index {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.5s ease 2.2s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 2.2s;
}

.visible .vn2-index {
  opacity: 1;
  transform: none;
}

.vn2-curtain {
  @apply overflow-hidden rounded-[2rem];
  clip-path: inset(0 0 100% 0 round 2rem);
  transition: clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
}

.vn2-curtain img {
  transform: scale(1.2);
  transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
}

.visible .vn2-curtain {
  clip-path: inset(0 round 2rem);
}

.visible .vn2-curtain img {
  transform: none;
}

/* Etapas */
.vn2-stack-card {
  transform: scale(calc(1 - var(--c, 0) * 0.06));
  filter: brightness(calc(1 - var(--c, 0) * 0.2));
  transform-origin: 50% 0;
  will-change: transform;
}

/* Jornada */
.vn2-row-track {
  transform: translateX(calc(-12vw + (var(--j, 0.5) - 0.5) * var(--dir) * -36vw));
  will-change: transform;
}

.vn2-word {
  font-size: clamp(3.75rem, 12.5vw, 11rem);
  @apply font-bold leading-[0.95] tracking-[-0.04em];
}

.vn2-outline {
  color: transparent;
  -webkit-text-stroke: 2px #003091;
}

/* Ponte */
.vn2-track-x {
  @apply absolute top-9 left-[12.5%] right-[12.5%] h-0.5 bg-white/15;
}

.vn2-track-x span {
  @apply block h-full bg-vn-yellow;
  transform: scaleX(var(--b, 1));
  transform-origin: 0 50%;
}

.vn2-track-y {
  @apply absolute left-9 top-9 bottom-9 w-0.5 bg-white/15;
}

.vn2-track-y span {
  @apply block w-full h-full bg-vn-yellow;
  transform: scaleY(var(--b, 1));
  transform-origin: 50% 0;
}

/* Empresas */
.vn2-spot {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.45s;
}

.vn2-spot::before {
  content: '';
  @apply absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none;
  background: radial-gradient(22rem circle at var(--mx, 50%) var(--my, 50%), rgba(235, 0, 140, 0.11), transparent 60%);
}

.vn2-spot:hover {
  transform: translateY(-5px);
  border-color: rgba(235, 0, 140, 0.3);
  box-shadow: 0 28px 50px -26px rgba(20, 37, 65, 0.4);
}

.vn2-spot:hover::before {
  @apply opacity-100;
}

.vn2-dots {
  background-image: radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px);
  background-size: 18px 18px;
  -webkit-mask-image: linear-gradient(120deg, #000, transparent 55%);
  mask-image: linear-gradient(120deg, #000, transparent 55%);
}

/* CTA final */
.vn2-final {
  --cp: 1;
}

.vn2-final-panel {
  clip-path: inset(calc((1 - var(--cp)) * 2.5rem) calc((1 - var(--cp)) * 6%) 0 round calc((1 - var(--cp)) * 3rem) calc((1 - var(--cp)) * 3rem) 0 0);
}

.vn2-eq {
  @apply flex flex-wrap justify-center items-baseline gap-x-3 sm:gap-x-5 font-bold tracking-[-0.03em] text-vn-navy text-[2.1rem] sm:text-[3rem] lg:text-[4.5rem] leading-[1.1];
}

.vn2-eq > span {
  display: inline-block;
  opacity: 0;
  transform: translateY(40px) rotate(4deg);
  transition: opacity 0.6s ease, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.visible .vn2-eq > span {
  opacity: 1;
  transform: none;
}

.vn2-result {
  @apply inline-block font-bold tracking-[-0.03em] text-[2.3rem] sm:text-6xl lg:text-[5.25rem] leading-none text-vn-navy px-4 py-2;
  background: linear-gradient(#eb008c, #eb008c) no-repeat 0 50% / 0% 100%;
  transition: background-size 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.8s, color 0.4s ease 1s;
}

.visible .vn2-result {
  @apply text-white;
  background-size: 100% 100%;
}

/* CTA flutuante */
.vn2 .vn2-floating,
.vn2 .vn2-floating:hover {
  @apply fixed z-40 bottom-5 left-1/2 rounded-full pl-4 pr-6 py-3.5 text-base font-bold whitespace-nowrap bg-vn-pink text-white;
  translate: -50% 0;
  box-shadow: 0 18px 40px -14px rgba(235, 0, 140, 0.75);
}

@media (min-width: 1024px) {
  .vn2 .vn2-floating,
  .vn2 .vn2-floating:hover {
    left: auto;
    right: 2rem;
    translate: 0 0;
  }
}

.vn2-float-enter-active,
.vn2-float-leave-active {
  transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.vn2-float-enter-from,
.vn2-float-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.9);
}

[data-vn-parallax] {
  translate: 0 var(--py, 0px);
  will-change: translate;
}

.vn2 :deep(.reveal) {
  filter: blur(10px);
  transition-duration: 0.9s;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.vn2 :deep(.reveal.visible) {
  filter: none;
}

.vn2 :deep(.reveal.vn2-pop-in) {
  transform: translateY(48px) scale(0.9) rotate(-3deg);
  transition-timing-function: cubic-bezier(0.34, 1.4, 0.64, 1);
}

.vn2 :deep(.reveal.vn2-pop-in.is-r) {
  transform: translateY(48px) scale(0.9) rotate(3deg);
}

.vn2 :deep(.reveal.vn2-pop-in.visible) {
  transform: none;
}

/* No celular: sem blur (pesado) e deslocamento maior */
@media (max-width: 1023px) {
  .vn2 :deep(.reveal:not(.vn2-pop-in)) {
    filter: none;
    transform: translateY(40px);
  }

  .vn2 :deep(.reveal.visible:not(.vn2-pop-in)) {
    transform: none;
  }
}

.vn2-snap {
  scrollbar-width: none;
}

.vn2-snap::-webkit-scrollbar {
  display: none;
}

@keyframes vn2-in {
  from {
    opacity: 0;
    transform: translateY(26px);
    filter: blur(10px);
  }
}

@keyframes vn2-person {
  from {
    opacity: 0;
    transform: translateY(70px);
  }
}

@keyframes vn2-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes vn2-pop {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.85);
  }
}

@keyframes vn2-bob {
  50% {
    transform: translateY(-10px);
  }
}

@keyframes vn2-wheel {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vn2-in,
  .vn2-person,
  .vn2-pop,
  .vn2-bob,
  .vn2-mouse::after {
    animation: none;
  }

  .vn2-draw :deep(path) {
    animation: none;
    stroke-dashoffset: 0;
  }

  .vn2 :deep(.reveal) {
    filter: none;
  }

  .vn2-hero {
    position: relative;
  }

  .vn2-hero-inner {
    opacity: 1;
    transform: none;
  }

  .vn2-chip,
  .vn2-index,
  .vn2-eq > span {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .vn2-funnel path {
    stroke-dashoffset: 0;
    transition: none;
  }

  .vn2-curtain,
  .vn2-curtain img {
    clip-path: none;
    transform: none;
    transition: none;
  }
}
</style>
