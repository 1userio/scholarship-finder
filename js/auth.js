const cfg=window.SCHOLARSHIP_FINDER_CONFIG||{};
const hasConfig=!!(window.supabase&&cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_URL.includes('PASTE_'));
const client = hasConfig
  ? (
      window.__SF_SUPABASE__ ||
      (window.__SF_SUPABASE__ = window.supabase.createClient(
        cfg.SUPABASE_URL,
        cfg.SUPABASE_ANON_KEY
      ))
    )
  : null;
const params=new URLSearchParams(location.search);
let mode=params.get('mode')==='login'?'login':'signup';
const title=document.getElementById('title'),intro=document.getElementById('intro'),form=document.getElementById('form'),nameLabel=document.getElementById('nameLabel'),submit=document.getElementById('submit'),switchText=document.getElementById('switchText'),message=document.getElementById('message');

function setMessage(text,kind='error'){message.hidden=false;message.className='auth-message '+kind;message.textContent=text;}
function render(){
  const login=mode==='login';
  title.textContent=login?'Welcome back':'Create your account';
  intro.textContent=hasConfig?(login?'Sign in to continue to your scholarship dashboard.':'Create a free account to sync your scholarship progress across devices.'):(login?'The account form is ready, but the secure backend still needs to be connected.':'The account form is ready. Connect the backend to enable real accounts.');
  nameLabel.style.display=login?'none':'grid';
  submit.textContent=login?'Sign in':'Create account';
  submit.disabled=false;
  switchText.innerHTML=login?'Need an account? <button type="button" id="switch">Create one</button>':'Already have an account? <button type="button" id="switch">Sign in</button>';
  document.getElementById('switch').onclick=()=>{mode=mode==='login'?'signup':'login';history.replaceState(null,'',`auth.html?mode=${mode}`);message.hidden=true;render();};
}
document.getElementById('guest').onclick=()=>{
  localStorage.setItem('sf-mode','guest');
  const id=params.get('return');
  location.href=id?`scholarship.html?id=${encodeURIComponent(id)}`:'index.html';
};
form.addEventListener('submit',async e=>{
  e.preventDefault();message.hidden=true;
  if(!hasConfig){setMessage('The secure account system is not connected yet. Guest mode is ready, and we can connect authentication once the project backend is set up.');return;}
  const email=document.getElementById('email').value.trim(),password=document.getElementById('password').value,name=document.getElementById('name').value.trim();
  submit.disabled=true;submit.textContent=mode==='login'?'Signing in...':'Creating...';
  try{
    let result;
    if(mode==='signup'){
      result=await client.auth.signUp({email,password,options:{data:{display_name:name}}});
      if(result.error)throw result.error;
      if(!result.data.session){setMessage('Account created. Check your email to confirm it, then sign in.','success');return;}
    }else{
      result=await client.auth.signInWithPassword({email,password});
      if(result.error)throw result.error;
    }
    localStorage.setItem('sf-mode','account');
    location.href='dashboard.html';
  }catch(err){setMessage(err.message||'Something went wrong.');}
  finally{submit.disabled=false;submit.textContent=mode==='login'?'Sign in':'Create account';}
});
render();
