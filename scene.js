import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  Mesh,
  MeshStandardMaterial,
  AmbientLight,
  DirectionalLight,
  SphereGeometry,
  BoxGeometry,
  CylinderGeometry,
  PlaneGeometry,
  Shape,
  ExtrudeGeometry,
  CatmullRomCurve3,
  Vector3,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  ACESFilmicToneMapping,
} from "three";
export function createStory(canvas, state) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new Scene(),
    camera = new PerspectiveCamera(35, 1, 0.1, 50),
    root = new Group();
  scene.add(root);
  scene.add(new AmbientLight("#fff3df", 2.5));
  const key = new DirectionalLight("#fff4de", 4);
  key.position.set(-4, 7, 7);
  scene.add(key);
  const fill = new DirectionalLight("#cbdacb", 2);
  fill.position.set(5, 3, -4);
  scene.add(fill);
  const mat = (color) =>
    new MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 });
  const paper = mat("#f4eddb"),
    clay = mat("#b1c1ae"),
    ink = mat("#344b3f"),
    muted = mat("#8b9c83"),
    accent = mat("#c6512d"),
    boxMat = mat("#c3a782");
  function rounded(w, h, d, m, parent, x = 0, y = 0, z = 0) {
    const r = Math.min(w, h) * 0.12,
      s = new Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const mesh = new Mesh(
      new ExtrudeGeometry(s, {
        depth: d,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025,
        curveSegments: 5,
      }),
      m,
    );
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  const cloud = new Group();
  cloud.position.set(-0.35, 1.85, -0.25);
  root.add(cloud);
  [
    [-0.7, 0, 0.47],
    [-0.24, 0.22, 0.65],
    [0.35, 0.05, 0.53],
    [0.75, -0.12, 0.35],
  ].forEach(([x, y, r]) => {
    const m = new Mesh(new SphereGeometry(r, 24, 16), clay);
    m.position.set(x, y, 0);
    m.scale.z = 0.7;
    cloud.add(m);
  });
  const invoice = new Group();
  invoice.position.set(0, -1.25, 0.3);
  invoice.rotation.x = -0.95;
  root.add(invoice);
  const sheet = new PlaneGeometry(2.1, 2.55, 12, 16);
  const positions = sheet.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    positions.setZ(i, Math.max(0, -y - 0.8) ** 2 * 0.8);
  }
  sheet.computeVertexNormals();
  const sheetMat = paper.clone();
  sheetMat.side = 2;
  invoice.add(new Mesh(sheet, sheetMat));
  const back = rounded(2.08, 2.52, 0.035, paper, invoice, 0, 0, -0.07);
  const heading = rounded(0.83, 0.11, 0.025, ink, invoice, -0.4, 0.95, 0.04);
  rounded(0.49, 0.045, 0.02, muted, invoice, -0.57, 0.74, 0.04);
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const row = new Group();
    row.position.set(0, 0.35 - i * 0.34, 0.045);
    invoice.add(row);
    rounded(1.05, 0.065, 0.015, muted, row, -0.25, 0);
    rounded(0.22, 0.065, 0.015, ink, row, 0.68, 0);
    rows.push(row);
  }
  const total = new Group();
  total.position.set(0, -0.81, 0.06);
  invoice.add(total);
  rounded(1.5, 0.025, 0.01, muted, total, 0, 0.18);
  rounded(0.55, 0.1, 0.02, ink, total, -0.46, 0);
  rounded(0.38, 0.1, 0.02, ink, total, 0.58, 0);
  const paid = new Group();
  paid.position.set(0.57, -0.67, 0.1);
  paid.rotation.z = -0.18;
  invoice.add(paid);
  rounded(0.48, 0.48, 0.025, accent, paid);
  function bar(parent, w, h, x, y, angle = 0) {
    const b = new Mesh(new BoxGeometry(w, h, 0.02), paper);
    b.position.set(x, y, 0.06);
    b.rotation.z = angle;
    parent.add(b);
  }
  bar(paid, 0.28, 0.035, 0, 0.13);
  bar(paid, 0.28, 0.035, 0, 0.035);
  bar(paid, 0.035, 0.16, 0.065, 0.065, -0.5);
  bar(paid, 0.19, 0.035, -0.025, -0.035);
  bar(paid, 0.035, 0.2, 0.015, -0.12, 0.7);
  const stamp = new Group();
  invoice.add(stamp);
  stamp.position.set(0.57, -0.67, 1);
  rounded(0.55, 0.55, 0.09, accent, stamp);
  const handle = new Mesh(new CylinderGeometry(0.1, 0.15, 0.45, 16), ink);
  handle.rotation.x = Math.PI / 2;
  handle.position.z = 0.3;
  stamp.add(handle);
  const path = new CatmullRomCurve3([
    new Vector3(-0.4, 1.4, 0),
    new Vector3(-1.1, 0.9, 0.65),
    new Vector3(0.45, 0.2, 0.8),
    new Vector3(-0.25, -0.7, 0.5),
  ]);
  const guide = new Line(
    new BufferGeometry().setFromPoints(path.getPoints(50)),
    new LineBasicMaterial({
      color: "#9fac99",
      transparent: true,
      opacity: 0.32,
    }),
  );
  root.add(guide);
  const cards = [];
  for (let i = 0; i < 3; i++) {
    const g = new Group();
    root.add(g);
    rounded(0.65, 0.43, 0.04, paper, g);
    rounded(0.36, 0.04, 0.01, ink, g, -0.06, 0.06, 0.07);
    rounded(0.23, 0.03, 0.01, muted, g, -0.12, -0.06, 0.07);
    cards.push(g);
  }
  const stock = new Group();
  root.add(stock);
  stock.position.set(1.45, -1.13, 0.25);
  for (let i = 0; i < 3; i++) {
    const g = new Group();
    g.position.set((i % 2) * 0.48, Math.floor(i / 2) * 0.46, -(i % 2) * 0.2);
    stock.add(g);
    const b = new Mesh(new BoxGeometry(0.45, 0.44, 0.45), boxMat);
    g.add(b);
    const tape = new Mesh(new BoxGeometry(0.1, 0.445, 0.455), paper);
    g.add(tape);
  }
  const base = new Mesh(
    new CylinderGeometry(2.25, 2.25, 0.07, 64),
    mat("#e2ded0"),
  );
  base.position.y = -1.65;
  root.add(base);
  root.traverse((o) => {
    if (o.isMesh) o.material = o.material.clone();
  });
  let lastSelection = "";
  function highlight() {
    const id = state.mode + state.selected;
    if (id === lastSelection) return;
    lastSelection = id;
    root.traverse((o) => {
      if (o.isMesh && o.material.emissive) o.material.emissive.set("#000000");
    });
    const selected =
      state.mode === "avs"
        ? [cards[0], invoice, stock, paid][state.selected]
        : [cloud, cards[0], guide, total][state.selected];
    selected?.traverse((o) => {
      if (o.isMesh && o.material.emissive) o.material.emissive.set("#35160a");
    });
    guide.material.color.set(
      state.mode === "salesforce" && state.selected === 2
        ? "#c6512d"
        : "#9fac99",
    );
  }
  let elapsed = 0,
    last = 0,
    visible = true,
    running = false,
    drag = false,
    yaw = -0.12,
    pitch = 0,
    px = 0,
    py = 0,
    lastX = 0,
    lastY = 0;
  let small = matchMedia("(max-width:650px)").matches;
  const ease = (x) => {
    x = Math.max(0, Math.min(1, x));
    return x * x * (3 - 2 * x);
  };
  const target = new Vector3(),
    look = new Vector3();
  function frame(time) {
    const dt = Math.min((time - last) / 1000, 0.04);
    last = time;
    if (!state.paused) elapsed += dt;
    const t = elapsed % 9,
      reset = 1 - ease((t - 8) / 1);
    cloud.position.y =
      1.85 + (state.mode === "salesforce" && state.selected === 0 ? 0.12 : 0);
    stock.visible = !small;
    stock.position.y =
      -1.13 + (state.mode === "avs" && state.selected === 2 ? 0.18 : 0);
    cards.forEach((g, i) => {
      const p = (t - i * 0.85) / 2.4;
      g.visible = p >= 0 && p < 1 && (!small || i < 2);
      g.position.copy(path.getPoint(ease(p)));
      g.rotation.set(
        -0.25 - ease(p) * 0.7,
        Math.sin(elapsed + i) * 0.12,
        -0.15 + ease(p) * 0.3,
      );
      g.scale.setScalar(
        0.8 + Math.sin(Math.PI * Math.max(0, Math.min(1, p))) * 0.2,
      );
    });
    rows.forEach((r, i) => {
      const scale = ease((t - 2.2 - i * 0.85) / 0.5) * reset;
      r.scale.x = Math.max(0.001, scale);
      r.position.z = 0.045 + (1 - reset) * 0.4;
    });
    total.scale.x = Math.max(0.001, ease((t - 4.6) / 0.65) * reset);
    paid.scale.setScalar(Math.max(0.001, ease((t - 6) / 0.16) * reset));
    stamp.visible = t > 5.2 && t < 7.4;
    stamp.position.z =
      0.15 + (1 - ease((t - 5.3) / 0.7)) * 0.9 + ease((t - 6.4) / 0.8) * 1.2;
    stamp.scale.z = t > 6 && t < 6.3 ? 0.8 + ease((t - 6) / 0.3) * 0.2 : 1;
    stock.children.forEach((b, i) => {
      b.scale.setScalar(Math.max(0.001, ease((t - 3 - i * 0.6) / 0.6) * reset));
    });
    const focus = state.mode === "avs" ? 1 : state.scroll * 0.9;
    target.set(4.6 - focus * 0.5, 3.4 - focus * 0.6, 7.6 - focus * 0.5);
    camera.position.lerp(target, 0.07);
    look.set(0, 0.3 - focus * 0.65, 0);
    camera.lookAt(look);
    root.rotation.y += (yaw + px * 0.08 - root.rotation.y) * 0.07;
    root.rotation.x += (pitch + py * 0.035 - root.rotation.x) * 0.07;
    highlight();
    invoice.position.y =
      -1.25 + (state.mode === "avs" && state.selected === 1 ? 0.13 : 0);
    paid.position.z =
      0.1 + (state.mode === "avs" && state.selected === 3 ? 0.12 : 0);
    total.position.z =
      0.06 + (state.mode === "salesforce" && state.selected === 3 ? 0.13 : 0);
    guide.position.y =
      state.mode === "salesforce" && state.selected === 2 ? 0.12 : 0;
    if (
      (state.mode === "salesforce" && state.selected === 1) ||
      (state.mode === "avs" && state.selected === 0)
    )
      cards[0].position.y += 0.13;
    renderer.render(scene, camera);
  }
  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    renderer.setAnimationLoop(frame);
  }
  function stop() {
    running = false;
    renderer.setAnimationLoop(null);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    small = rect.width < 400;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    if (visible) start();
    else stop();
  }).observe(canvas);
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : start(),
  );
  canvas.addEventListener("pointerdown", (e) => {
    drag = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (drag) {
      yaw = Math.max(-0.8, Math.min(0.8, yaw + (e.clientX - lastX) * 0.004));
      pitch = Math.max(
        -0.2,
        Math.min(0.25, pitch + (e.clientY - lastY) * 0.002),
      );
      lastX = e.clientX;
      lastY = e.clientY;
    } else {
      const r = canvas.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - 0.5;
      py = (e.clientY - r.top) / r.height - 0.5;
    }
  });
  ["pointerup", "pointercancel"].forEach((name) =>
    canvas.addEventListener(name, () => (drag = false)),
  );
  canvas.addEventListener("pointerleave", () => {
    px = py = 0;
  });
  canvas.addEventListener("keydown", (e) => {
    if (!e.key.startsWith("Arrow")) return;
    e.preventDefault();
    yaw = Math.max(
      -0.8,
      Math.min(
        0.8,
        yaw + (e.key === "ArrowLeft" ? -0.1 : e.key === "ArrowRight" ? 0.1 : 0),
      ),
    );
    pitch = Math.max(
      -0.2,
      Math.min(
        0.25,
        pitch +
          (e.key === "ArrowUp" ? -0.05 : e.key === "ArrowDown" ? 0.05 : 0),
      ),
    );
  });
  let suspended = false;
  const originalStart = start;
  start = () => {
    if (!suspended) originalStart();
  };
  resize();
  return {
    update(next) {
      state = next;
    },
    resume() {
      suspended = false;
      resize();
      start();
    },
    suspend() {
      suspended = true;
      stop();
    },
  };
}
