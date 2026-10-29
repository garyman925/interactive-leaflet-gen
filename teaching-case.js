(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const ai = '結尾未充分扣題，宜補充放晴後的景物描寫，並呼應開首的心願。';
  const concrete = '你已寫出雨變小、風停了。接著請補寫一至三句：放晴後，你看見甚麼景物？選一個細節寫清楚，再寫出自己的感受。最後重讀一次，看看是否接得上原文。';
  const initialTask = '本次目標：補寫放晴後的景象，並連到自己的感受。你也可以返回第 2 步，調整老師的提示。';
  let applied = '', checkedDraft = '', currentStep = 0;
  const editor = $('#teacherComment'), draft = $('#endingDraft');
  const checks = ['#checkScene','#checkFeeling','#checkConnection'].map($);
  function setStep(i, focus=true) {
    currentStep=i;
    document.querySelectorAll('[data-case-step]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.caseStep===i));
    for(let k=0;k<3;k++)$('#caseStep'+k).hidden=k!==i;
    $('#casePosition').textContent=`第 ${i+1} 步，共 3 步`;
    if(focus){const h=$('#caseTitle'+i);h.tabIndex=-1;h.focus({preventScroll:true});$('#micro-demo .case-tabs').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
  }
  document.querySelectorAll('[data-case-step]').forEach(b=>b.onclick=()=>setStep(+b.dataset.caseStep));
  document.querySelectorAll('[data-case-next]').forEach(b=>b.onclick=()=>setStep(+b.dataset.caseNext));
  function editing(){
    const changed=editor.value.trim()!==applied;
    $('#teacherStatus').textContent=applied?(changed?'有未更新的修改；學生預覽仍保留上一個版本。':'目前文字已更新至學生預覽。'):'尚未更新學生預覽。';
    $('#previewState').textContent=applied?(changed?'顯示上一次更新的版本。':'與老師目前確認的文字一致。'):'預覽尚未建立。';
    $('#receivedVersion').textContent=applied?(changed?'目前使用老師上一次確認的提示；老師有尚未更新的草稿。':'目前使用老師已確認的提示。'):'老師尚未更新提示；目前按本頁的示例目標練習。';
    $('#applyTeacherComment').disabled=!editor.value.trim();
  }
  editor.addEventListener('input',editing);
  $('#loadTeacherExample').onclick=()=>{editor.value=concrete;editing();$('#teacherStatus').textContent='已載入具體提示，請檢視後更新學生預覽。';};
  $('#restoreTeacherComment').onclick=()=>{editor.value=ai;editing();};
  $('#applyTeacherComment').onclick=()=>{
    const text=editor.value.trim();if(!text){$('#teacherStatus').textContent='請先輸入給學生的提示。';return;}
    if(text!==applied){invalidateResult();checkedDraft='';checks.forEach(c=>c.checked=false);if(draft.value.trim())$('#endingStatus').textContent='老師提示已更新，請按新提示重新檢查；你的結尾草稿已保留。';}
    applied=text;$('#studentCommentPreview').textContent=text;$('#receivedComment').textContent=text;editing();
    $('#teacherStatus').textContent='已更新本頁學生預覽；沒有提交至平台。';
  };
  function invalidateResult(){
    $('#endingResult').hidden=true;$('#endingEmpty').hidden=false;
    $('#myEnding').textContent='';
  }
  draft.addEventListener('input',()=>{
    const hadReview=!!checkedDraft;invalidateResult();checkedDraft='';checks.forEach(c=>c.checked=false);
    $('#endingStatus').textContent=hadReview?'你修改了結尾，請按新版本重新檢查三項目標。':'';
  });
  checks.forEach(c=>c.addEventListener('change',()=>{
    if(!checks.every(x=>x.checked)){invalidateResult();checkedDraft='';$('#endingStatus').textContent='請完成三項自我檢查，再查看比較。';}
  }));
  $('#reviewEnding').onclick=()=>{
    const text=draft.value.trim();
    if(!text){invalidateResult();$('#endingStatus').textContent='先寫下你補充的結尾，再檢查修改目標。';draft.focus();return;}
    if(!checks.every(c=>c.checked)){invalidateResult();$('#endingStatus').textContent='請逐項確認三項修改目標；如未做到，可先回到結尾修改。';return;}
    checkedDraft=text;$('#myEnding').textContent=text;$('#endingResult').hidden=false;$('#endingEmpty').hidden=true;
    $('#endingStatus').textContent='已完成這一版的自我檢查。比較區保留你的文字，仍需教師審閱。';
  };
  function resetCase(){
    applied='';checkedDraft='';editor.value=ai;draft.value='';checks.forEach(c=>c.checked=false);
    $('#studentCommentPreview').textContent='先在老師編輯區調整提示，再按「更新學生預覽」。';$('#receivedComment').textContent=initialTask;
    $('#endingStatus').textContent='';invalidateResult();editing();setStep(0);closeReset();
  }
  function closeReset(){ $('#caseResetConfirm').hidden=true;$('#resetTeachingCase').setAttribute('aria-expanded','false'); }
  $('#resetTeachingCase').onclick=()=>{const changed=editor.value!==ai||applied||draft.value||checks.some(c=>c.checked);if(!changed){resetCase();return;}$('#caseResetConfirm').hidden=false;$('#resetTeachingCase').setAttribute('aria-expanded','true');$('#cancelCaseReset').focus({preventScroll:true});};
  $('#confirmCaseReset').onclick=resetCase;
  $('#cancelCaseReset').onclick=()=>{closeReset();$('#resetTeachingCase').focus({preventScroll:true});};
  function setMode(mode,focus=true){
    const hands=mode==='hands';$('#quickCase').hidden=hands;$('#handsOnCase').hidden=!hands;
    document.querySelectorAll('[data-case-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.caseMode===mode));
    if(focus){if(hands)setStep(currentStep);else{const h=$('#quickCase .quick-title');h.focus({preventScroll:true});$('.case-mode').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}
  }
  document.querySelectorAll('[data-case-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.caseMode));
  document.querySelectorAll('[data-enter-hands]').forEach(b=>b.onclick=()=>{setMode('hands',false);setStep(1);});
  document.querySelectorAll('[data-case-step]').forEach((b,i)=>{if(i===0){const icon=document.createElement('span');icon.className='shared-reading-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 3h12l4 4v14H4zM16 3v5h4M8 12h8M8 16h8"/></svg>';b.prepend(icon);b.setAttribute('aria-label','1 · 共同閱讀：看原文與問題');}else{const img=document.createElement('img');img.src='media/flow/avatar-'+(i===1?'t':'s')+'.png';img.alt='';img.width=30;img.height=30;b.prepend(img);}});
  editing();setStep(currentStep,false);setMode('quick',false);
})();
