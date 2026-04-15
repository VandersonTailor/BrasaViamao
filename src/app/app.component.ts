import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';

interface ShowcaseContent {
  title: string;
  verse: string;
  lesson: string;
  heart: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly host: HTMLElement;
  private readonly teardownFns: Array<() => void> = [];
  private readonly timeouts: number[] = [];
  private readonly intervals: number[] = [];

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    this.host = this.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.initVideoPlayback();
    this.initHeroTyping();
    this.initRotatingWord();
    this.initChurchGallery();
    this.initScrollAndReveal();
  }

  ngOnDestroy(): void {
    this.timeouts.forEach((id) => window.clearTimeout(id));
    this.intervals.forEach((id) => window.clearInterval(id));
    this.teardownFns.forEach((fn) => fn());
  }

  private initHeroTyping(): void {
    const heroTextEl = this.host.querySelector<HTMLElement>('#hero-typing');
    if (!heroTextEl) return;
    const fullText = heroTextEl.dataset['text'] ?? heroTextEl.textContent?.trim() ?? '';

    let typingTimer: number | null = null;
    let isTyping = false;

    const typeHeroText = () => {
      if (isTyping) return;
      isTyping = true;
      heroTextEl.textContent = '';
      let index = 0;

      const step = () => {
        heroTextEl.textContent = fullText.slice(0, index + 1);
        index += 1;
        if (index < fullText.length) {
          typingTimer = window.setTimeout(step, 85);
          this.timeouts.push(typingTimer);
        } else {
          isTyping = false;
        }
      };

      step();
    };

    typeHeroText();

    const hero = this.host.querySelector<HTMLElement>('#inicio');
    if (!hero) return;

    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.65 && !isTyping) {
            if (typingTimer !== null) {
              window.clearTimeout(typingTimer);
            }
            typeHeroText();
          }
        });
      },
      { threshold: [0.65] }
    );

    heroObserver.observe(hero);
    this.teardownFns.push(() => heroObserver.disconnect());
  }

  private initVideoPlayback(): void {
    const videos = Array.from(this.host.querySelectorAll<HTMLVideoElement>('video'));
    if (!videos.length) return;

    const playSilently = (video: HTMLVideoElement) => {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute('muted', '');
      void video.play().catch(() => {
        // Ignore autoplay errors until user interaction.
      });
    };

    videos.forEach((video) => {
      playSilently(video);
      const onCanPlay = () => playSilently(video);
      video.addEventListener('canplay', onCanPlay);
      this.teardownFns.push(() => video.removeEventListener('canplay', onCanPlay));
    });

    const tryPlayAll = () => videos.forEach((video) => playSilently(video));
    const onUserGesture = () => tryPlayAll();
    window.addEventListener('click', onUserGesture, { passive: true });
    window.addEventListener('touchstart', onUserGesture, { passive: true });
    document.addEventListener('visibilitychange', onUserGesture);

    this.teardownFns.push(() => {
      window.removeEventListener('click', onUserGesture);
      window.removeEventListener('touchstart', onUserGesture);
      document.removeEventListener('visibilitychange', onUserGesture);
    });
  }

  private initRotatingWord(): void {
    const el = this.host.querySelector<HTMLElement>('#rotating-word');
    if (!el) return;

    const words = ['novo', 'diferente', 'especial', 'marcante', 'transformador', 'cheio de esperança'];
    let i = 0;

    const intervalId = window.setInterval(() => {
      i = (i + 1) % words.length;
      el.classList.add('is-changing');
      const timeoutId = window.setTimeout(() => {
        el.textContent = words[i];
        el.classList.remove('is-changing');
      }, 180);
      this.timeouts.push(timeoutId);
    }, 1400);

    this.intervals.push(intervalId);
  }

  private initChurchGallery(): void {
    const gallery = this.host.querySelector<HTMLElement>('#church-gallery');
    if (!gallery) return;

    const seedCards = Array.from(gallery.querySelectorAll<HTMLElement>('.polaroid-card'));
    if (!seedCards.length) return;

    const titleEl = this.host.querySelector<HTMLElement>('#showcase-title');
    const verseEl = this.host.querySelector<HTMLElement>('#showcase-verse');
    const lessonEl = this.host.querySelector<HTMLElement>('#showcase-lesson');
    const heartEl = this.host.querySelector<HTMLElement>('#showcase-heart');

    const content: Record<string, ShowcaseContent> = {
      casais: {
        title: 'Culto de Casais',
        verse: '"Melhor é serem dois do que um..." (Eclesiastes 4:9-10)',
        lesson: 'Lição: quando caminhamos juntos em Deus, o amor é fortalecido.',
        heart: 'Aqui, cada família encontra cuidado, escuta e esperança.'
      },
      mulheres: {
        title: 'Culto de Mulheres',
        verse: '"A mulher que teme ao Senhor, essa será louvada." (Provérbios 31:30)',
        lesson: 'Lição: identidade, fé e coragem para viver o propósito de Deus.',
        heart: 'Um ambiente de acolhimento, cura e encorajamento para cada mulher.'
      },
      escola: {
        title: 'Escola Bíblica',
        verse: '"Lâmpada para os meus pés é a tua palavra." (Salmos 119:105)',
        lesson: 'Lição: aprender a Palavra transforma decisões e fortalece a fé.',
        heart: 'Crescemos juntos, com fundamento, verdade e amor.'
      },
      batismo: {
        title: 'Culto de Batismo',
        verse: '"Quem crer e for batizado será salvo." (Marcos 16:16)',
        lesson: 'Lição: o batismo é um passo de fé, obediência e nova vida em Cristo.',
        heart: 'Celebramos juntos cada vida transformada pelo amor de Jesus.'
      }
    };

    let activeCard: HTMLElement | null = null;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let rafId = 0;
    let isAdjustingLoop = false;
    const seedCount = seedCards.length;

    const cloneBlock = (cards: HTMLElement[]) => cards.map((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.classList.remove('is-active');
      return clone;
    });

    const before = cloneBlock(seedCards);
    const after = cloneBlock(seedCards);
    before.forEach((card) => gallery.insertBefore(card, gallery.firstChild));
    after.forEach((card) => gallery.appendChild(card));

    let cards = Array.from(gallery.querySelectorAll<HTMLElement>('.polaroid-card'));

    const render = (key: string) => {
      const item = content[key];
      if (!item || !titleEl || !verseEl || !lessonEl || !heartEl) return;
      titleEl.textContent = item.title;
      verseEl.textContent = item.verse;
      lessonEl.textContent = item.lesson;
      heartEl.textContent = item.heart;
    };

    const setActiveCard = (card: HTMLElement | null) => {
      if (!card || activeCard === card) return;
      activeCard = card;
      cards.forEach((node) => node.classList.toggle('is-active', node === activeCard));
      render(card.dataset['showcase'] ?? '');
    };

    const updateWheelVisuals = () => {
      const centerX = gallery.scrollLeft + gallery.clientWidth / 2;
      const radius = gallery.clientWidth * 0.58;
      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = cardCenter - centerX;
        const normalized = Math.max(-1, Math.min(1, distance / radius));
        const abs = Math.abs(normalized);
        const rotate = normalized * 20;
        const y = abs * 52;
        const scale = 0.02 - abs * 0.08;
        const opacity = 1 - abs * 0.45;
        card.style.setProperty('--wheel-rotate', `${rotate}deg`);
        card.style.setProperty('--wheel-y', `${y}px`);
        card.style.setProperty('--wheel-scale', `${scale}`);
        card.style.opacity = `${Math.max(0.5, opacity)}`;
      });
    };

    const centerDistance = (card: HTMLElement | null) => {
      if (!card) return Number.POSITIVE_INFINITY;
      const centerX = gallery.scrollLeft + gallery.clientWidth / 2;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      return Math.abs(cardCenter - centerX);
    };

    const getCenterCard = () => {
      const centerX = gallery.scrollLeft + gallery.clientWidth / 2;
      let best: HTMLElement | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - centerX);
        if (distance < bestDistance) {
          best = card;
          bestDistance = distance;
        }
      });
      return best;
    };

    const blockWidth = () => {
      if (cards.length < seedCount + 1) return 0;
      return cards[seedCount].offsetLeft - cards[0].offsetLeft;
    };

    const keepInfiniteLoop = () => {
      if (isAdjustingLoop) return;
      const width = blockWidth();
      if (!width) return;
      const middleStart = cards[seedCount].offsetLeft;
      const minEdge = middleStart - width * 0.5;
      const maxEdge = middleStart + width * 0.5;
      const current = gallery.scrollLeft;
      let adjusted = current;

      if (current < minEdge) {
        adjusted = current + width;
      } else if (current > maxEdge) {
        adjusted = current - width;
      }

      if (adjusted !== current) {
        isAdjustingLoop = true;
        gallery.scrollLeft = adjusted;
        isAdjustingLoop = false;
      }
    };

    const syncActiveFromCenter = () => {
      keepInfiniteLoop();
      const candidate = getCenterCard();
      if (!activeCard) {
        setActiveCard(candidate);
      } else if (candidate && candidate !== activeCard) {
        const currentDist = centerDistance(activeCard);
        const nextDist = centerDistance(candidate);
        if (nextDist + 16 < currentDist) {
          setActiveCard(candidate);
        }
      }
      updateWheelVisuals();
    };

    const scheduleSync = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(syncActiveFromCenter);
    };

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest('.polaroid-card') as HTMLElement | null;
      if (!card) return;
      const targetLeft = card.offsetLeft + card.offsetWidth / 2 - gallery.clientWidth / 2;
      gallery.scrollLeft = targetLeft;
      scheduleSync();
    };

    const onScroll = () => scheduleSync();

    const onPointerDown = (event: PointerEvent) => {
      isDown = true;
      gallery.classList.add('is-dragging');
      startX = event.clientX;
      startScroll = gallery.scrollLeft;
      gallery.setPointerCapture(event.pointerId);
    };

    const stopDrag = () => {
      isDown = false;
      gallery.classList.remove('is-dragging');
      scheduleSync();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDown) return;
      event.preventDefault();
      const walk = (event.clientX - startX) * 0.78;
      gallery.scrollLeft = startScroll - walk;
      scheduleSync();
    };

    gallery.addEventListener('click', onClick);
    gallery.addEventListener('scroll', onScroll, { passive: true });
    gallery.addEventListener('pointerdown', onPointerDown);
    gallery.addEventListener('pointerleave', stopDrag);
    gallery.addEventListener('pointerup', stopDrag);
    gallery.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', scheduleSync);

    const startId = window.requestAnimationFrame(() => {
      cards = Array.from(gallery.querySelectorAll<HTMLElement>('.polaroid-card'));
      gallery.scrollLeft = cards[seedCount].offsetLeft;
      syncActiveFromCenter();
    });

    this.teardownFns.push(() => {
      window.cancelAnimationFrame(rafId);
      window.cancelAnimationFrame(startId);
      gallery.removeEventListener('click', onClick);
      gallery.removeEventListener('scroll', onScroll);
      gallery.removeEventListener('pointerdown', onPointerDown);
      gallery.removeEventListener('pointerleave', stopDrag);
      gallery.removeEventListener('pointerup', stopDrag);
      gallery.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', scheduleSync);
    });
  }

  private initScrollAndReveal(): void {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const smoothScrollTo = (targetY: number, duration: number) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    };

    const links = Array.from(this.host.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    links.forEach((link) => {
      const clickHandler = (event: Event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = this.host.querySelector<HTMLElement>(href);
        if (!target) return;
        event.preventDefault();
        const offset = 88;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
        if (prefersReduced) {
          window.scrollTo(0, targetY);
        } else {
          smoothScrollTo(targetY, 1100);
        }
        history.replaceState(null, '', href);
      };

      link.addEventListener('click', clickHandler);
      this.teardownFns.push(() => link.removeEventListener('click', clickHandler));
    });

    const revealTargets = Array.from(
      this.host.querySelectorAll<HTMLElement>(
        '.intro h2, .intro p, .intro .card, .cult-info, .cult-video, .church-showcase-content > *, .social-video-card, .section-social .card, .ministry-item, .footer-grid > div'
      )
    );

    const total = revealTargets.length;
    let lastY = window.scrollY;
    let scrollDirection: 'down' | 'up' = 'down';

    revealTargets.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
    });

    if (prefersReduced) {
      revealTargets.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const onWindowScroll = () => {
      const currentY = window.scrollY;
      scrollDirection = currentY >= lastY ? 'down' : 'up';
      lastY = currentY;
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = revealTargets.indexOf(entry.target as HTMLElement);
          const seqIndex = scrollDirection === 'down' ? index : total - 1 - index;
          (entry.target as HTMLElement).style.setProperty('--reveal-delay', `${Math.max(0, (seqIndex % 5) * 90)}ms`);

          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));

    this.teardownFns.push(() => {
      window.removeEventListener('scroll', onWindowScroll);
      observer.disconnect();
    });
  }
}
