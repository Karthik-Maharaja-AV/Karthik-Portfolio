export function createLiquidRenderer({ root, heroPin }) {
  const canvas=document.createElement('canvas');canvas.className='ap-liquid-canvas';canvas.setAttribute('aria-hidden','true');
  let gl;
  try{gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});}catch{return null;}
  if(!gl)return null;
  const vertex=`attribute vec2 a; void main(){gl_Position=vec4(a,0.0,1.0);}`;
  const fragment=`
precision highp float;
uniform vec2 uSize;
uniform float uProgress;
uniform float uMobile;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float ease(float x){x=clamp(x,0.0,1.0);return x*x*(3.0-2.0*x);}
float shape(vec3 p){
  float t=uProgress;
  float middle=ease(t/.48)*(1.0-ease((t-.5)/.25));
  float angle=1.10-.72*middle+.47*ease((t-.52)/.24);
  p.xy=rot(-.42+t*1.15)*p.xy;
  p.yz=rot(angle)*p.yz;
  float theta=atan(p.z,p.x);
  float wave=sin(theta*3.0+t*6.0)*.08*middle;
  vec2 q=vec2(length(p.xz)-1.05-wave,p.y);
  return length(q)-(.31+.055*middle);
}
vec3 environment(vec3 r){
  vec3 c=mix(vec3(.035,.042,.08),vec3(.38,.40,.53),smoothstep(-.75,.85,r.y));
  float stripe=pow(max(0.0,1.0-abs(r.y-.32)*2.0),13.0);
  float stripe2=pow(max(0.0,1.0-abs(r.x+.45)*2.5),22.0);
  c+=vec3(.85,.91,1.0)*stripe*1.7;
  c+=vec3(.45,.56,1.0)*stripe2*.85;
  c+=vec3(.52,.18,.55)*pow(max(0.0,dot(r,normalize(vec3(.85,.2,-.5)))),9.0);
  c+=vec3(.10,.23,.7)*pow(max(0.0,dot(r,normalize(vec3(-.7,-.15,.65)))),7.0);
  return c;
}
void main(){
  float t=uProgress;
  vec2 uv=(gl_FragCoord.xy-.5*uSize)/uSize.y*2.0;
  float move=ease(t/.36);
  float zoom=ease((t-.57)/.34);
  uv.x-=mix(.64,0.0,uMobile)*(1.0-move*.3)*(1.0-zoom);
  uv.y+=mix(.14,.44,uMobile)*(1.0-zoom);
  vec3 ro=vec3(0.0,0.0,mix(4.8,.35,zoom));
  vec3 rd=normalize(vec3(uv,-1.65));
  float d=0.0;float hit=0.0;vec3 p=ro;
  for(int i=0;i<70;i++){
    p=ro+rd*d;
    float h=shape(p);
    if(h<.0015){hit=1.0;break;}
    d+=h*.78;
    if(d>12.0)break;
  }
  vec3 col=vec3(.001,.001,.004);
  float glow=exp(-length(uv-vec2(.3,-.2))*2.8);
  col+=vec3(.024,.035,.095)*glow;
  if(hit>.5){
    vec2 e=vec2(.002,0.0);
    vec3 n=normalize(vec3(shape(p+e.xyy)-shape(p-e.xyy),shape(p+e.yxy)-shape(p-e.yxy),shape(p+e.yyx)-shape(p-e.yyx)));
    vec3 reflected=reflect(rd,n);
    float fres=pow(1.0-max(0.0,dot(-rd,n)),3.0);
    float diffuse=max(0.0,dot(n,normalize(vec3(-.5,1.0,1.5))));
    float spec=pow(max(0.0,dot(reflect(-normalize(vec3(-.8,1.4,2.0)),n),-rd)),70.0);
    col=environment(reflected)*(.65+.35*fres);
    col+=vec3(.16,.17,.22)*diffuse+vec3(.9,.93,1.0)*spec*.8;
    col+=vec3(.18,.12,.37)*fres*.6;
    col*=.8+.2*clamp(shape(p+n*.17)/.17,0.0,1.0);
  }
  col=col/(vec3(.65)+col);
  col=pow(col,vec3(.82));
  gl_FragColor=vec4(col,1.0);
}`;
  function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;}
  const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
  if(!vs||!fs)return null;
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const attr=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
  const size=gl.getUniformLocation(program,'uSize'),progress=gl.getUniformLocation(program,'uProgress'),mobile=gl.getUniformLocation(program,'uMobile');
  let lost=false;
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;root.classList.remove('ap-gpu');});
  heroPin.prepend(canvas);root.classList.add('ap-gpu');
  return {resize(w,h){const ratio=Math.min(devicePixelRatio||1,1.15,1400/w,1000/h);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(size,canvas.width,canvas.height);gl.uniform1f(mobile,w<650?1:0);},draw(value){if(lost||document.hidden)return;gl.uniform1f(progress,value);gl.drawArrays(gl.TRIANGLES,0,6);}};
}
