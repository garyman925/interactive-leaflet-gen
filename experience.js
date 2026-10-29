(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chapters = [
    {title:'先準備討論，再讓學生動筆。',name:'課前準備',teacher:'設定題目及評改標準，檢視、調整課堂討論材料。',student:'打開寫作引導及課堂內容，預習並記下想法。',gain:'把準備材料接上學生的課前構思。',focus:'留意：教師設定題目，學生開始思考；兩個畫面屬於同一個課前階段。'},
    {title:'課堂構思，接上作文上載。',name:'課堂寫作',teacher:'引導審題與取材。可把全班作文掃描成一個 PDF 批量上載，系統分頁及辨認學生。',student:'參與討論、完成寫作，再用手機或平板拍照上載。',gain:'配合課堂原有寫作方式，讓作品進入回饋流程。',focus:'留意：這是課堂材料及學生作文畫面；批量上載方式需在實際平台中操作。'},
    {title:'回饋先經老師，修改交回學生。',name:'評改回饋',teacher:'檢視分數及評語，按教學需要調整，設定分層批改的重點。',student:'查看個人回饋，逐項理解問題，得到有針對性的改進建議。',gain:'教師保留最終決定權，學生有清楚的修改方向。',focus:'留意：教師畫面有評分及分析；學生畫面展示個人成長建議。'},
    {title:'從一次批改，走到下一次寫作。',name:'反思修訂',teacher:'分享佳作、回顧全班強弱項，派發修訂練習，安排再次寫作。',student:'參與反思、完成個人練習，提交第二、三次寫作，累積成長紀錄。',gain:'讓回饋成為後續教學和練習的起點。',focus:'留意：教師截圖為佳作分享；學生截圖為個人修訂練習，並非完整報告。'}
  ];
  const image = (role,i) => `media/flow/${role}${i+1}.jpg`;
  function shot(role,i) {
    const name = role==='t'?'老師':'學生';
    return `<figure><figcaption class="shot-role role-${role}"><img src="media/flow/avatar-${role}.png" alt="" width="32" height="32"><span>${name}端 · 實際畫面</span></figcaption><button class="source-image" type="button" data-image="${image(role,i)}" data-caption="${chapters[i].name} · ${name}畫面"><img src="${image(role,i)}" alt="${chapters[i].name}：${name}端實際平台截圖" loading="lazy"></button></figure>`;
  }
  $('#storyChapters').innerHTML=chapters.map((c,i)=>`<article class="story-chapter" id="chapter-${i}" data-chapter="${i}"><p class="chapter-number">${String(i+1).padStart(2,'0')} · ${c.name}</p><h3>${c.title}</h3><div class="role-copy teacher"><b><img src="media/flow/avatar-t.png" alt="" width="32" height="32">老師</b><p>${c.teacher}</p></div><div class="role-copy student"><b><img src="media/flow/avatar-s.png" alt="" width="32" height="32">學生</b><p>${c.student}</p></div><p class="chapter-gain">${c.gain}</p><div class="mobile-story-images">${shot('t',i)}${shot('s',i)}</div>${i===2?'<a class="text-link" href="#trial">預約查看實際批改流程</a>':''}</article>`).join('');
  let active=0, perspective='pair';
  function renderShowcase(i){
    active=i; $('#showcaseTitle').textContent=chapters[i].name;
    $('#showcaseImages').innerHTML=(perspective==='pair'?['t','s']:[perspective]).map(r=>shot(r,i)).join('');
    $('#showcaseImages').classList.toggle('single-view',perspective!=='pair');
    $('#showcaseInsight').textContent=chapters[i].focus;
    document.querySelectorAll('[data-chapter-link]').forEach(a=>{if(+a.dataset.chapterLink===i)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
    document.querySelectorAll('.story-chapter').forEach(a=>a.classList.toggle('is-current',+a.dataset.chapter===i));
  }
  document.querySelectorAll('[data-perspective]').forEach(b=>b.onclick=()=>{perspective=b.dataset.perspective;document.querySelectorAll('[data-perspective]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderShowcase(active);});
  $('#focusScreenshot').onclick=()=>{const on=$('#focusScreenshot').getAttribute('aria-pressed')!=='true';$('#focusScreenshot').setAttribute('aria-pressed',on);$('#showcaseImages').classList.toggle('focused',on);$('#focusScreenshot').textContent=on?'還原畫面':'聚焦畫面';};
  renderShowcase(0);
  let frame=0;
  function updateStory(){
    frame=0;
    {const sections=[...document.querySelectorAll('.story-chapter')]; const target=innerHeight*.42;let nearest=0,distance=Infinity;sections.forEach((el,i)=>{const r=el.getBoundingClientRect();const d=Math.abs((r.top+r.bottom)/2-target);if(d<distance){distance=d;nearest=i;}});if(nearest!==active)renderShowcase(nearest);}
  }
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateStory);},{passive:true});addEventListener('resize',()=>{if(!frame)frame=requestAnimationFrame(updateStory);});
  document.querySelectorAll('[data-chapter-link]').forEach(a=>a.addEventListener('click',()=>renderShowcase(+a.dataset.chapterLink)));
  const filmObserver=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)$('#demoVideo').pause();},{threshold:0});filmObserver.observe($('#demoVideo'));
  const dialog=$('#productDialog');let imageTrigger;
  document.addEventListener('click',e=>{const b=e.target.closest('[data-image]');if(!b)return;imageTrigger=b;$('#productDialogImage').hidden=false;$('#productDialogImage').src=b.dataset.image;$('#productDialogImage').alt=b.dataset.caption;$('#productDialogTitle').textContent=b.dataset.caption;dialog.showModal();});
  $('#closeProduct').onclick=()=>dialog.close();dialog.addEventListener('close',()=>imageTrigger?.focus({preventScroll:true}));
  const hint=$('#hintPane'),result=$('#revisionResult');
  $('#showHint').onclick=()=>{hint.hidden=false;$('#showHint').hidden=true;$('#microExplain').textContent='學生先看提示，嘗試修改；教師再判斷建議是否適合。';$('#revisionAnswer').focus({preventScroll:true});};
  function showResult(success){result.hidden=false;$('#revisionFeedback').textContent=success?'改對了！「越來越少」寫出了逐漸變化。':'參考寫法是「越來越少」。想一想，它比「越少」多交代了甚麼？';$('#microExplain').textContent=success?'你已完成一次由提示到修訂的練習。':'參考寫法幫助學生比較原句，再理解修改原因。';}
  $('#revisionForm').onsubmit=e=>{e.preventDefault();const v=$('#revisionAnswer').value.trim().replace(/[\s。，,.]/g,'');if(v==='越來越少')showResult(true);else {result.hidden=true;$('#microExplain').textContent='再比較原句與提示，試試完整的說法。';$('#revisionFeedback').textContent='再想一想：表示程度持續變化，可以用「越……越……」的完整說法。';}};
  $('#showReference').onclick=()=>showResult(false);
  $('#resetMicro').onclick=()=>{hint.hidden=true;result.hidden=true;$('#showHint').hidden=false;$('#revisionAnswer').value='';$('#revisionFeedback').textContent='';$('#microExplain').textContent='點開批注，體驗一個從提示到修訂的過程。';$('#showHint').focus({preventScroll:true});};
  document.querySelectorAll('[data-idea]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-idea]').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#guideReply').textContent=b.dataset.idea==='weather'?'下一個問題：雨停前後，陽光、水珠或小動物有甚麼不同？選一個你親眼見過的變化，說說細節。':'下一個問題：甚麼事情令你失望？天氣轉晴時，你的想法又怎樣改變？試把心情與景物連起來。';});
})();
