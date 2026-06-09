"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Perlin noise vertex shader ──────────────────────────────────────── */
const vertexShader = `
  uniform float uTime;
  uniform float uTurbulence;
  varying vec2  vUv;
  varying float vElevation;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x,289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159-0.85373472095314*r; }
  vec3 fade(vec3 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec3 P){
    vec3 Pi0=floor(P), Pi1=Pi0+vec3(1.0);
    Pi0=mod(Pi0,289.0); Pi1=mod(Pi1,289.0);
    vec3 Pf0=fract(P), Pf1=Pf0-vec3(1.0);
    vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
    vec4 iy=vec4(Pi0.yy,Pi1.yy);
    vec4 iz0=Pi0.zzzz, iz1=Pi1.zzzz;
    vec4 ixy=permute(permute(ix)+iy);
    vec4 ixy0=permute(ixy+iz0), ixy1=permute(ixy+iz1);
    vec4 gx0=ixy0/7.0, gy0=fract(floor(gx0)/7.0)-0.5;
    gx0=fract(gx0);
    vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);
    vec4 sz0=step(gz0,vec4(0.0));
    gx0-=sz0*(step(0.0,gx0)-0.5); gy0-=sz0*(step(0.0,gy0)-0.5);
    vec4 gx1=ixy1/7.0, gy1=fract(floor(gx1)/7.0)-0.5;
    gx1=fract(gx1);
    vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);
    vec4 sz1=step(gz1,vec4(0.0));
    gx1-=sz1*(step(0.0,gx1)-0.5); gy1-=sz1*(step(0.0,gy1)-0.5);
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x), g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z), g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x), g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z), g111=vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g100,g100),dot(g010,g010),dot(g110,g110)));
    g000*=norm0.x; g100*=norm0.y; g010*=norm0.z; g110*=norm0.w;
    vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g101,g101),dot(g011,g011),dot(g111,g111)));
    g001*=norm1.x; g101*=norm1.y; g011*=norm1.z; g111*=norm1.w;
    float n000=dot(g000,Pf0), n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)), n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z)), n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz)), n111=dot(g111,Pf1);
    vec3 fxyz=fade(Pf0);
    vec4 nz=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fxyz.z);
    vec2 nyz=mix(nz.xy,nz.zw,fxyz.y);
    return 2.2*mix(nyz.x,nyz.y,fxyz.x);
  }

  void main(){
    vUv = uv;
    vec3 pos = position;

    float e1 = cnoise(vec3(pos.x*1.3 + uTime*0.22, pos.y*1.3, uTime*0.12)) * uTurbulence;
    float e2 = cnoise(vec3(pos.x*3.2, pos.y*3.2, uTime*0.38))              * uTurbulence * 0.38;
    float e3 = cnoise(vec3(pos.x*7.0, pos.y*7.0, uTime*0.65))              * uTurbulence * 0.14;

    pos.z   += e1 + e2 + e3;
    vElevation = e1 + e2 + e3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ─── Fragment shader ─────────────────────────────────────────────────── */
const fragmentShader = `
  uniform vec3  uColorDeep;
  uniform vec3  uColorMid;
  uniform vec3  uColorPeak;
  uniform float uTurbulence;
  varying float vElevation;
  varying vec2  vUv;

  void main(){
    float norm = clamp((vElevation / (uTurbulence + 0.001) + 0.5), 0.0, 1.0);
    vec3  col  = mix(uColorDeep, uColorMid,  smoothstep(0.0, 0.55, norm));
          col  = mix(col,        uColorPeak, smoothstep(0.55, 1.0, norm));

    /* soft edge fade so the mesh blends into the bg */
    float ex = smoothstep(0.0,0.12,vUv.x)*smoothstep(1.0,0.88,vUv.x);
    float ey = smoothstep(0.0,0.12,vUv.y)*smoothstep(1.0,0.88,vUv.y);

    gl_FragColor = vec4(col, ex * ey * 0.92);
  }
`;

/* ─── Wave mesh (must live inside <Canvas>) ───────────────────────────── */
function WaveMesh({
  turbulenceRef,
}: {
  turbulenceRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime:       { value: 0 },
      uTurbulence: { value: 0.18 },
      uColorDeep:  { value: new THREE.Color("#030C18") },
      uColorMid:   { value: new THREE.Color("#00507A") },
      uColorPeak:  { value: new THREE.Color("#00AEEF") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value       = clock.getElapsedTime();
    mat.uniforms.uTurbulence.value = turbulenceRef.current;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.6, 0, 0.08]}
      position={[0, -0.6, 0]}
    >
      <planeGeometry args={[9, 9, 160, 160]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Camera drift controller ─────────────────────────────────────────── */
function CameraRig({
  targetYRef,
}: {
  targetYRef: React.MutableRefObject<number>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.y +=
      (targetYRef.current - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Exported component ──────────────────────────────────────────────── */
export default function HeroWaveBackground() {
  const turbulenceRef = useRef(0.18);
  const cameraYRef    = useRef(2.6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#hero-section",
        start:   "top top",
        end:     "bottom top",
        scrub:   2,
        onUpdate(self) {
          turbulenceRef.current = 0.18 + self.progress * 0.52;
          cameraYRef.current    = 2.6  + self.progress * 1.0;
        },
      });

      /* text fade on scroll */
      gsap.to("#hero-overlay-content", {
        opacity:  0,
        y:        -30,
        ease:     "power1.in",
        scrollTrigger: {
          trigger: "#hero-section",
          start:   "top top",
          end:     "40% top",
          scrub:   1.2,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 2.6, 4.2], fov: 52 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <WaveMesh turbulenceRef={turbulenceRef} />
      <CameraRig   targetYRef={cameraYRef} />
    </Canvas>
  );
}
