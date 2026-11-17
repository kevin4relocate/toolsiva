import {w11Parse,w11Format,w11Result} from "./wave11Core.mjs";
export function w11Physics(slug,input){switch(slug){
 case "projectile-range-level-ground": {
    const a=w11Parse(input,2,"Projectile Range on Level Ground");
    if(!(a[0]>=0&&a[1]>=0&&a[1]<=90))throw Error("Projectile Range on Level Ground input out of domain. Expected launch speed m/s | launch angle degrees");
    const value=a[0]**2*Math.sin(2*a[1]*Math.PI/180)/9.80665;
    return w11Result("Projectile Range on Level Ground",value,"meters");
  }
 case "projectile-maximum-height": {
    const a=w11Parse(input,2,"Projectile Maximum Height");
    if(!(a[0]>=0&&a[1]>=0&&a[1]<=90))throw Error("Projectile Maximum Height input out of domain. Expected launch speed m/s | launch angle degrees");
    const value=(a[0]*Math.sin(a[1]*Math.PI/180))**2/(2*9.80665);
    return w11Result("Projectile Maximum Height",value,"meters");
  }
 case "projectile-flight-time": {
    const a=w11Parse(input,2,"Projectile Total Flight Time");
    if(!(a[0]>=0&&a[1]>=0&&a[1]<=90))throw Error("Projectile Total Flight Time input out of domain. Expected launch speed m/s | launch angle degrees");
    const value=2*a[0]*Math.sin(a[1]*Math.PI/180)/9.80665;
    return w11Result("Projectile Total Flight Time",value,"seconds");
  }
 case "freefall-time-from-height": {
    const a=w11Parse(input,1,"Free Fall Time from Height");
    if(!(a[0]>=0))throw Error("Free Fall Time from Height input out of domain. Expected vertical drop height meters");
    const value=Math.sqrt(2*a[0]/9.80665);
    return w11Result("Free Fall Time from Height",value,"seconds");
  }
 case "freefall-impact-speed": {
    const a=w11Parse(input,1,"Free Fall Impact Speed");
    if(!(a[0]>=0))throw Error("Free Fall Impact Speed input out of domain. Expected vertical drop height meters");
    const value=Math.sqrt(2*9.80665*a[0]);
    return w11Result("Free Fall Impact Speed",value,"m/s");
  }
 case "gravitational-force-two-masses": {
    const a=w11Parse(input,3,"Newtonian Gravitational Force");
    if(!(a[0]>0&&a[1]>0&&a[2]>0))throw Error("Newtonian Gravitational Force input out of domain. Expected mass 1 kg | mass 2 kg | center distance meters");
    const value=6.67430e-11*a[0]*a[1]/a[2]**2;
    return w11Result("Newtonian Gravitational Force",value,"newtons");
  }
 case "escape-velocity-from-gravity": {
    const a=w11Parse(input,2,"Escape Speed at Surface");
    if(!(a.every(x=>x>0)))throw Error("Escape Speed at Surface input out of domain. Expected planet mass kg | distance from center meters");
    const value=Math.sqrt(2*6.67430e-11*a[0]/a[1]);
    return w11Result("Escape Speed at Surface",value,"m/s");
  }
 case "circular-orbit-speed": {
    const a=w11Parse(input,2,"Circular Orbit Speed");
    if(!(a.every(x=>x>0)))throw Error("Circular Orbit Speed input out of domain. Expected central mass kg | orbital radius meters");
    const value=Math.sqrt(6.67430e-11*a[0]/a[1]);
    return w11Result("Circular Orbit Speed",value,"m/s");
  }
 case "circular-orbit-period": {
    const a=w11Parse(input,2,"Circular Orbit Period");
    if(!(a.every(x=>x>0)))throw Error("Circular Orbit Period input out of domain. Expected central mass kg | orbital radius meters");
    const value=2*Math.PI*Math.sqrt(a[1]**3/(6.67430e-11*a[0]));
    return w11Result("Circular Orbit Period",value,"seconds");
  }
 case "torque-from-force-angle": {
    const a=w11Parse(input,3,"Torque from Force at Angle");
    if(!(a[0]>=0&&a[1]>=0&&a[2]>=0&&a[2]<=180))throw Error("Torque from Force at Angle input out of domain. Expected force newtons | lever arm meters | angle degrees");
    const value=a[0]*a[1]*Math.sin(a[2]*Math.PI/180);
    return w11Result("Torque from Force at Angle",value,"N·m");
  }
 case "rotational-kinetic-energy": {
    const a=w11Parse(input,2,"Rotational Kinetic Energy");
    if(!(a[0]>=0))throw Error("Rotational Kinetic Energy input out of domain. Expected moment of inertia kg m² | angular speed rad/s");
    const value=0.5*a[0]*a[1]**2;
    return w11Result("Rotational Kinetic Energy",value,"joules");
  }
 case "solid-disk-moment-inertia": {
    const a=w11Parse(input,2,"Solid Disk Moment of Inertia");
    if(!(a.every(x=>x>0)))throw Error("Solid Disk Moment of Inertia input out of domain. Expected disk mass kg | disk radius meters");
    const value=0.5*a[0]*a[1]**2;
    return w11Result("Solid Disk Moment of Inertia",value,"kg·m²");
  }
 case "solid-sphere-moment-inertia": {
    const a=w11Parse(input,2,"Solid Sphere Moment of Inertia");
    if(!(a.every(x=>x>0)))throw Error("Solid Sphere Moment of Inertia input out of domain. Expected sphere mass kg | sphere radius meters");
    const value=0.4*a[0]*a[1]**2;
    return w11Result("Solid Sphere Moment of Inertia",value,"kg·m²");
  }
 case "mechanical-advantage-from-forces": {
    const a=w11Parse(input,2,"Mechanical Advantage from Forces");
    if(!(a[0]>=0&&a[1]>0))throw Error("Mechanical Advantage from Forces input out of domain. Expected output load force | applied effort force");
    const value=a[0]/a[1];
    return w11Result("Mechanical Advantage from Forces",value,"ratio");
  }
 case "engineering-stress-calculator": {
    const a=w11Parse(input,2,"Engineering Stress");
    if(!(a[0]>=0&&a[1]>0))throw Error("Engineering Stress input out of domain. Expected axial force newtons | original cross sectional area m²");
    const value=a[0]/a[1];
    return w11Result("Engineering Stress",value,"pascals");
  }
 case "engineering-strain-calculator": {
    const a=w11Parse(input,2,"Engineering Strain");
    if(!(a[1]>0))throw Error("Engineering Strain input out of domain. Expected length change meters | initial length meters");
    const value=a[0]/a[1];
    return w11Result("Engineering Strain",value,"ratio");
  }
 case "youngs-modulus-from-stress-strain": {
    const a=w11Parse(input,2,"Young's Modulus from Stress and Strain");
    if(!(a[1]!==0&&a[0]/a[1]>0))throw Error("Young's Modulus from Stress and Strain input out of domain. Expected axial stress pascals | axial engineering strain");
    const value=a[0]/a[1];
    return w11Result("Young's Modulus from Stress and Strain",value,"pascals");
  }
 case "speed-of-sound-air-temperature": {
    const a=w11Parse(input,1,"Approximate Sound Speed in Air");
    if(!(a[0]>=-50&&a[0]<=50))throw Error("Approximate Sound Speed in Air input out of domain. Expected air temperature Celsius");
    const value=331.3+0.606*a[0];
    return w11Result("Approximate Sound Speed in Air",value,"m/s");
  }
 case "echo-distance-from-roundtrip": {
    const a=w11Parse(input,2,"Echo Distance from Round Trip");
    if(!(a[0]>=0&&a[1]>0))throw Error("Echo Distance from Round Trip input out of domain. Expected round trip time seconds | sound speed m/s");
    const value=a[0]*a[1]/2;
    return w11Result("Echo Distance from Round Trip",value,"meters");
  }
 case "sound-pressure-level-calculator": {
    const a=w11Parse(input,1,"Sound Pressure Level");
    if(!(a[0]>0))throw Error("Sound Pressure Level input out of domain. Expected RMS sound pressure pascals");
    const value=20*Math.log10(a[0]/0.00002);
    return w11Result("Sound Pressure Level",value,"dB SPL");
  }
 default:return null;
}}
