import {w11Parse,w11Format,w11Result} from "./wave11Core.mjs";
export function w11Science(slug,input){switch(slug){
 case "moles-from-mass-molar-mass": {
    const a=w11Parse(input,2,"Moles from Mass and Molar Mass");
    if(!(a[0]>=0&&a[1]>0))throw Error("Moles from Mass and Molar Mass input out of domain. Expected mass grams | molar mass g/mol");
    const value=a[0]/a[1];
    return w11Result("Moles from Mass and Molar Mass",value,"mol");
  }
 case "mass-from-moles-molar-mass": {
    const a=w11Parse(input,2,"Mass from Moles and Molar Mass");
    if(!(a[0]>=0&&a[1]>0))throw Error("Mass from Moles and Molar Mass input out of domain. Expected amount mol | molar mass g/mol");
    const value=a[0]*a[1];
    return w11Result("Mass from Moles and Molar Mass",value,"grams");
  }
 case "solution-volume-percent": {
    const a=w11Parse(input,2,"Solution Volume Percent");
    if(!(a[0]>=0&&a[1]>0&&a[0]<=a[1]))throw Error("Solution Volume Percent input out of domain. Expected solute volume mL | final solution volume mL");
    const value=100*a[0]/a[1];
    return w11Result("Solution Volume Percent",value,"percent");
  }
 case "dilute-water-ppm-mg-l": {
    const a=w11Parse(input,2,"Approximate Water Concentration in ppm");
    if(!(a[0]>=0&&a[1]>0))throw Error("Approximate Water Concentration in ppm input out of domain. Expected dissolved mass mg | water solution volume L");
    const value=a[0]/a[1];
    return w11Result("Approximate Water Concentration in ppm",value,"ppm approx");
  }
 case "ideal-gas-density-calculator": {
    const a=w11Parse(input,3,"Ideal Gas Density");
    if(!(a.every(x=>x>0)))throw Error("Ideal Gas Density input out of domain. Expected pressure Pa | molar mass kg/mol | Kelvin");
    const value=a[0]*a[1]/(8.314462618*a[2]);
    return w11Result("Ideal Gas Density",value,"kg/m³");
  }
 case "dalton-partial-pressure": {
    const a=w11Parse(input,2,"Dalton Partial Pressure");
    if(!(a[0]>=0&&a[1]>=0&&a[1]<=1))throw Error("Dalton Partial Pressure input out of domain. Expected total pressure pascals | species mole fraction");
    const value=a[0]*a[1];
    return w11Result("Dalton Partial Pressure",value,"pascals");
  }
 case "mole-fraction-two-components": {
    const a=w11Parse(input,2,"Mole Fraction of Component A");
    if(!(a.every(x=>x>=0)&&a[0]+a[1]>0))throw Error("Mole Fraction of Component A input out of domain. Expected component A mol | component B mol");
    const value=a[0]/(a[0]+a[1]);
    return w11Result("Mole Fraction of Component A",value,"ratio");
  }
 case "ideal-gas-rms-molecular-speed": {
    const a=w11Parse(input,2,"Ideal Gas RMS Molecular Speed");
    if(!(a.every(x=>x>0)))throw Error("Ideal Gas RMS Molecular Speed input out of domain. Expected gas temperature Kelvin | molar mass kg/mol");
    const value=Math.sqrt(3*8.314462618*a[0]/a[1]);
    return w11Result("Ideal Gas RMS Molecular Speed",value,"m/s");
  }
 case "gas-molecule-mean-kinetic-energy": {
    const a=w11Parse(input,1,"Gas Molecule Mean Translational Energy");
    if(!(a[0]>0))throw Error("Gas Molecule Mean Translational Energy input out of domain. Expected gas temperature Kelvin");
    const value=1.5*1.380649e-23*a[0];
    return w11Result("Gas Molecule Mean Translational Energy",value,"joules per molecule");
  }
 case "coulomb-electric-force-magnitude": {
    const a=w11Parse(input,3,"Electrostatic Force Magnitude");
    if(!(a[2]>0))throw Error("Electrostatic Force Magnitude input out of domain. Expected charge Q1 coulombs | charge Q2 coulombs | separation meters");
    const value=8.9875517923e9*Math.abs(a[0]*a[1])/a[2]**2;
    return w11Result("Electrostatic Force Magnitude",value,"newtons");
  }
 case "point-charge-electric-field": {
    const a=w11Parse(input,2,"Point Charge Electric Field Magnitude");
    if(!(a[1]>0))throw Error("Point Charge Electric Field Magnitude input out of domain. Expected point charge coulombs | radial distance meters");
    const value=8.9875517923e9*Math.abs(a[0])/a[1]**2;
    return w11Result("Point Charge Electric Field Magnitude",value,"N/C");
  }
 case "point-charge-electric-potential": {
    const a=w11Parse(input,2,"Point Charge Electric Potential");
    if(!(a[1]>0))throw Error("Point Charge Electric Potential input out of domain. Expected point charge coulombs | radial distance meters");
    const value=8.9875517923e9*a[0]/a[1];
    return w11Result("Point Charge Electric Potential",value,"volts");
  }
 case "resistive-wire-resistance": {
    const a=w11Parse(input,3,"Wire Resistance from Resistivity");
    if(!(a[0]>=0&&a[1]>0&&a[2]>0))throw Error("Wire Resistance from Resistivity input out of domain. Expected material resistivity ohm m | wire length meters | cross section m²");
    const value=a[0]*a[1]/a[2];
    return w11Result("Wire Resistance from Resistivity",value,"ohms");
  }
 case "electric-conductance-from-resistance": {
    const a=w11Parse(input,1,"Electrical Conductance");
    if(!(a[0]>0))throw Error("Electrical Conductance input out of domain. Expected resistance ohms");
    const value=1/a[0];
    return w11Result("Electrical Conductance",value,"siemens");
  }
 case "photon-energy-from-wavelength": {
    const a=w11Parse(input,1,"Photon Energy from Wavelength");
    if(!(a[0]>0))throw Error("Photon Energy from Wavelength input out of domain. Expected vacuum wavelength nanometers");
    const value=6.62607015e-34*299792458/(a[0]*1e-9*1.602176634e-19);
    return w11Result("Photon Energy from Wavelength",value,"eV");
  }
 case "photon-frequency-from-wavelength": {
    const a=w11Parse(input,1,"Photon Frequency from Wavelength");
    if(!(a[0]>0))throw Error("Photon Frequency from Wavelength input out of domain. Expected vacuum wavelength nanometers");
    const value=299792458/(a[0]*1e-9);
    return w11Result("Photon Frequency from Wavelength",value,"hertz");
  }
 case "thin-lens-focal-length": {
    const a=w11Parse(input,2,"Thin Lens Focal Length");
    if(!(a[0]!==0&&a[1]!==0&&Math.abs(1/a[0]+1/a[1])>1e-15))throw Error("Thin Lens Focal Length input out of domain. Expected object distance | image distance");
    const value=1/(1/a[0]+1/a[1]);
    return w11Result("Thin Lens Focal Length",value,"distance units");
  }
 case "thin-lens-lateral-magnification": {
    const a=w11Parse(input,2,"Thin Lens Lateral Magnification");
    if(!(a[0]!==0))throw Error("Thin Lens Lateral Magnification input out of domain. Expected object distance | image distance");
    const value=-a[1]/a[0];
    return w11Result("Thin Lens Lateral Magnification",value,"ratio");
  }
 case "snells-law-refraction-angle": {
    const a=w11Parse(input,3,"Snell's Law Refracted Angle");
    if(!(a[0]>0&&a[1]>0&&a[2]>=0&&a[2]<=90&&a[0]*Math.sin(a[2]*Math.PI/180)<=a[1]+1e-12))throw Error("Snell's Law Refracted Angle input out of domain. Expected incident index n1 | transmitted index n2 | incident angle degrees");
    const value=Math.asin(a[0]*Math.sin(a[2]*Math.PI/180)/a[1])*180/Math.PI;
    return w11Result("Snell's Law Refracted Angle",value,"degrees");
  }
 case "total-internal-reflection-critical-angle": {
    const a=w11Parse(input,2,"Critical Angle for Total Internal Reflection");
    if(!(a[0]>a[1]&&a[1]>0))throw Error("Critical Angle for Total Internal Reflection input out of domain. Expected higher refractive index | lower refractive index");
    const value=Math.asin(a[1]/a[0])*180/Math.PI;
    return w11Result("Critical Angle for Total Internal Reflection",value,"degrees");
  }
 default:return null;
}}
