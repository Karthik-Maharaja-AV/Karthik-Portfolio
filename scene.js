import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const canvas=document.querySelector('#sculpture');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let paused=reduced,mode='salesforce',selected=0;
const motion=document.querySelector('#motion'),info=document.querySelector('#system-description');
const systems={salesforce:{name:'Salesforce',color:'#368bd1',labels:['CRM','Automation','Access','Data'],descriptions:['CRM · Opportunity and forecast behavior, connected to real business rules.','Automation · Apex and guided Flow experiences that carry work forward.','Access · Permission sets and integration-user access for the right workflows.','Data · Salesforce fields connected to reporting and downstream models.']},avs:{name:'avs-corp',color:'#c76a3e',labels:['Sales','Inventory','Production','Insights'],descriptions:['Sales · Follow the journey from lead and quote to invoice and payment.','Inventory · Track warehouses, FIFO lots, transfers, and stock movement.','Production · Connect bills of materials, component consumption, and output lots.','Insights · Explore configurable reports and views across business operations.']}};
function motionLabel(){motion.textContent=paused?'▶':'Ⅱ';motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Play workflow animation':'Pause workflow animation')};motionLabel();
let setScene=()=>{},selectScene=()=>{};
function update(){const s=systems[mode];info.textContent=s.descriptions[selected];document.querySelectorAll('[data-system]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.system===mode)));document.querySelectorAll('[data-node]').forEach((b,i)=>{b.textContent=s.labels[i];b.setAttribute('aria-pressed',String(i===selected))});setScene(s);selectScene(selected)}
document.querySelectorAll('[data-system]').forEach(b=>b.onclick=()=>{mode=b.dataset.system;selected=0;update()});document.querySelectorAll('[data-node]').forEach(b=>b.onclick=()=>{selected=Number(b.dataset.node);update()});motion.onclick=()=>{paused=!paused;motionLabel()};
try{
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(5.1,6.1,7.4);camera.lookAt(0,0,0);
 const pm=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pm.fromScene(room,.04);scene.environment=env.texture;room.dispose();pm.dispose();scene.add(new THREE.AmbientLight(0xffffff,1.4));const key=new THREE.DirectionalLight(0xfff6e9,3);key.position.set(-3,8,5);scene.add(key);
 const root=new THREE.Group();scene.add(root);
 const cream=new THREE.MeshPhysicalMaterial({color:'#ece7db',roughness:.35,metalness:.05});const accent=new THREE.MeshPhysicalMaterial({color:systems.salesforce.color,roughness:.25,metalness:.25,clearcoat:.8});const dark=new THREE.MeshStandardMaterial({color:'#42534b',roughness:.4});
 function box(w,h,d,mat,parent,x=0,y=0,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);parent.add(mesh);return mesh}
 function label(text,width=1.5){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#263b32';ctx.font='600 45px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64);const map=new THREE.CanvasTexture(c);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,depthTest:false}));sprite.scale.set(width,width/4,1);return sprite}
 const platform=new THREE.Group();root.add(platform);box(2.05,.18,1.6,cream,platform,0,-.15,0);box(1.85,.18,1.42,accent,platform,0,.06,0);box(1.63,.12,1.22,cream,platform,0,.23,0);
 const cloud=new THREE.Group();platform.add(cloud);cloud.position.y=.53;[[-.45,0,.29],[0,.16,.4],[.43,0,.3]].forEach(([x,y,r])=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,28,18),accent);m.scale.z=.65;m.position.set(x,y,0);cloud.add(m)});
 let mainLabel=label('Salesforce',2);mainLabel.position.set(0,1.45,0);root.add(mainLabel);
 const positions=[[-2.6,0,.15],[.15,0,-2.55],[2.6,0,-.05],[-.1,0,2.55]],nodes=[],labels=[],pulses=[],paths=[];
 positions.forEach(([x,y,z],i)=>{const group=new THREE.Group();group.position.set(x,y,z);root.add(group);const mat=cream.clone();box(1.15,.22,1.04,mat,group);const top=box(.99,.05,.88,accent,group,0,.135,0);
 if(i===0){[-.24,0,.24].forEach((u,j)=>{const sphere=new THREE.Mesh(new THREE.SphereGeometry(j===1?.15:.12,20,14),dark);sphere.position.set(u,.43,0);group.add(sphere);box(.16,.19,.15,dark,group,u,.25,0)})}
 if(i===1){for(let k=0;k<3;k++)box(.2,.2,.2,cream,group,(k-1)*.28,.3,(k%2)*.22-.1)}
 if(i===2){const t=new THREE.Mesh(new THREE.TorusGeometry(.22,.055,12,28,Math.PI),dark);t.position.set(0,.53,0);group.add(t);box(.5,.3,.21,cream,group,0,.3,0)}
 if(i===3){[.2,.4,.58].forEach((h,j)=>box(.17,h,.22,cream,group,(j-1)*.25,.18+h/2,0))}
 const lab=label(systems.salesforce.labels[i],1.65);lab.position.set(x,1.05,z);root.add(lab);labels.push(lab);nodes.push({group,mat,top});
 const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,-.05,0),new THREE.Vector3(x*.5,-.1,z*.5),new THREE.Vector3(x,0,z));paths.push(curve);const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)),new THREE.LineBasicMaterial({color:'#abb9a5',transparent:true,opacity:.8}));root.add(line);const pulse=new THREE.Mesh(new THREE.SphereGeometry(.055,12,8),accent);root.add(pulse);pulses.push(pulse);
 });
 const base=new THREE.Mesh(new THREE.CylinderGeometry(3.65,3.65,.045,90),new THREE.MeshStandardMaterial({color:'#e3e1d5',transparent:true,opacity:.45,roughness:.8}));base.position.y=-.38;root.add(base);
 function replaceLabel(old,text,width){const pos=old.position.clone();root.remove(old);old.material.map.dispose();old.material.dispose();const n=label(text,width);n.position.copy(pos);root.add(n);return n}
 setScene=s=>{accent.color.set(s.color);mainLabel=replaceLabel(mainLabel,s.name,2);labels.forEach((l,i)=>labels[i]=replaceLabel(l,s.labels[i],1.65));cloud.visible=mode==='salesforce';};
 selectScene=n=>nodes.forEach((node,i)=>node.mat.color.set(i===n?'#d1dfc4':'#ece7db'));
 let dragging=false,moved=false,lastX=0,lastY=0,startX=0,startY=0,yaw=0,pitch=0,visible=true;
 canvas.onpointerdown=e=>{dragging=true;moved=false;startX=lastX=e.clientX;startY=lastY=e.clientY;canvas.setPointerCapture(e.pointerId)};
 canvas.onpointermove=e=>{if(!dragging)return;if(Math.hypot(e.clientX-startX,e.clientY-startY)>5)moved=true;yaw=Math.max(-.65,Math.min(.65,yaw+(e.clientX-lastX)*.004));pitch=Math.max(-.2,Math.min(.25,pitch+(e.clientY-lastY)*.002));lastX=e.clientX;lastY=e.clientY};
 const ray=new THREE.Raycaster();canvas.onpointerup=e=>{dragging=false;if(moved)return;const r=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hits=ray.intersectObjects(nodes.map(n=>n.group),true);if(hits.length){selected=nodes.findIndex(n=>{let o=hits[0].object;while(o){if(o===n.group)return true;o=o.parent}return false});if(selected>=0)update()}};canvas.onpointercancel=()=>dragging=false;
 canvas.onkeydown=e=>{if(e.key.startsWith('Arrow')){e.preventDefault();yaw=Math.max(-.65,Math.min(.65,yaw+(e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0)));pitch=Math.max(-.2,Math.min(.25,pitch+(e.key==='ArrowUp'?-.05:e.key==='ArrowDown'?.05:0)))}};
 const resize=()=>{const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(canvas);resize();new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(canvas);
 let elapsed=0,prev=0;renderer.setAnimationLoop(time=>{let dt=Math.min((time-prev)/1000,.05);prev=time;if(!visible||document.hidden)return;if(!paused)elapsed+=dt;const scroll=reduced?0:Math.min(1,Math.max(0,window.scrollY/800));root.rotation.y+=(yaw+scroll*.16-root.rotation.y)*.08;root.rotation.x+=(pitch-root.rotation.x)*.08;nodes.forEach((n,i)=>{n.group.position.y+=( (i===selected?.12:0)-n.group.position.y)*.08});pulses.forEach((p,i)=>p.position.copy(paths[i].getPoint((elapsed*.27+i*.25)%1)));renderer.render(scene,camera)});
}catch(e){canvas.hidden=true;document.querySelector('.fallback').hidden=false;motion.hidden=true;console.warn('3D workflow unavailable:',e.message)}update();
