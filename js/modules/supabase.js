import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://jazvlukzbwiaxexdwvgb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphenZsdWt6YndpYXhleGR3dmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjM3NzgsImV4cCI6MjEwNDAzOTc3OH0.Yi_Z0nsQfHEXDEZniq4fAVQceowPGuFVzQqzQ0p8HXY';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function initDynamicWorks(onComplete) {
  const container = document.querySelector('.bento-container');
  if (!container) return; // Not on the works page

  try {
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      container.innerHTML = ''; // clear any hardcoded/loading items
      
      data.forEach(work => {
        const a = document.createElement('a');
        a.href = work.url || '#';
        a.target = work.url ? '_blank' : '';
        a.rel = 'noopener';
        a.className = `bento-item anim-slide-up ${work.size_class}`;
        a.setAttribute('data-category', work.category);
        
        let numStr = work.sort_order < 10 ? '0' + work.sort_order : work.sort_order;
        
        a.innerHTML = `
          <div class="bento-item__bg">
            <img src="${work.image_url}" alt="${work.title} Preview">
          </div>
          <div class="bento-item__overlay"></div>
          <div class="bento-item__content">
            <span class="bento-num mono">${numStr}</span>
            <h3 class="bento-title tw-type">${work.title}</h3>
            <p class="bento-desc mono">${work.description || ''}</p>
          </div>
        `;
        
        container.appendChild(a);
      });
    }

    if (typeof onComplete === 'function') {
      onComplete();
    }
    
    // Re-trigger scroll animations for newly added elements if ScrollTrigger is active
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }

  } catch (err) {
    console.error('Failed to load works from Supabase:', err.message);
  }
}
