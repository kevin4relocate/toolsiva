import {w11Parse,w11Format,w11Result} from "./wave11Core.mjs";
export function w11Geometry(slug,input){switch(slug){
 case "triangle-third-side-cosine-rule": {
    const a=w11Parse(input,3,"Triangle Third Side (Cosine Rule)");
    if(!(a[0]>0&&a[1]>0&&a[2]>0&&a[2]<180))throw Error("Triangle Third Side (Cosine Rule) input out of domain. Expected side A | side B | included angle degrees");
    const value=Math.sqrt(a[0]**2+a[1]**2-2*a[0]*a[1]*Math.cos(a[2]*Math.PI/180));
    return w11Result("Triangle Third Side (Cosine Rule)",value,"units");
  }
 case "triangle-area-included-angle": {
    const a=w11Parse(input,3,"Triangle Area from Included Angle");
    if(!(a[0]>0&&a[1]>0&&a[2]>0&&a[2]<180))throw Error("Triangle Area from Included Angle input out of domain. Expected side A | side B | included angle degrees");
    const value=a[0]*a[1]*Math.sin(a[2]*Math.PI/180)/2;
    return w11Result("Triangle Area from Included Angle",value,"square units");
  }
 case "triangle-height-from-base-area": {
    const a=w11Parse(input,2,"Triangle Height from Base and Area");
    if(!(a[0]>0&&a[1]>=0))throw Error("Triangle Height from Base and Area input out of domain. Expected base length | triangle area");
    const value=2*a[1]/a[0];
    return w11Result("Triangle Height from Base and Area",value,"units");
  }
 case "right-triangle-missing-leg": {
    const a=w11Parse(input,2,"Missing Right Triangle Leg");
    if(!(a[0]>a[1]&&a[1]>0))throw Error("Missing Right Triangle Leg input out of domain. Expected hypotenuse | known leg");
    const value=Math.sqrt(a[0]**2-a[1]**2);
    return w11Result("Missing Right Triangle Leg",value,"units");
  }
 case "rectangular-prism-space-diagonal": {
    const a=w11Parse(input,3,"Rectangular Prism Space Diagonal");
    if(!(a.every(x=>x>0)))throw Error("Rectangular Prism Space Diagonal input out of domain. Expected length | width | height");
    const value=Math.hypot(...a);
    return w11Result("Rectangular Prism Space Diagonal",value,"units");
  }
 case "rectangular-prism-total-surface": {
    const a=w11Parse(input,3,"Rectangular Prism Total Surface Area");
    if(!(a.every(x=>x>0)))throw Error("Rectangular Prism Total Surface Area input out of domain. Expected length | width | height");
    const value=2*(a[0]*a[1]+a[1]*a[2]+a[0]*a[2]);
    return w11Result("Rectangular Prism Total Surface Area",value,"square units");
  }
 case "right-cone-total-surface-area": {
    const a=w11Parse(input,2,"Right Cone Total Surface Area");
    if(!(a.every(x=>x>0)))throw Error("Right Cone Total Surface Area input out of domain. Expected base radius | perpendicular height");
    const value=Math.PI*a[0]*(a[0]+Math.hypot(a[0],a[1]));
    return w11Result("Right Cone Total Surface Area",value,"square units");
  }
 case "cylinder-total-surface-area": {
    const a=w11Parse(input,2,"Cylinder Total Surface Area");
    if(!(a.every(x=>x>0)))throw Error("Cylinder Total Surface Area input out of domain. Expected radius | height");
    const value=2*Math.PI*a[0]*(a[0]+a[1]);
    return w11Result("Cylinder Total Surface Area",value,"square units");
  }
 case "hemisphere-volume-calculator": {
    const a=w11Parse(input,1,"Hemisphere Volume");
    if(!(a[0]>0))throw Error("Hemisphere Volume input out of domain. Expected hemisphere radius");
    const value=2*Math.PI*a[0]**3/3;
    return w11Result("Hemisphere Volume",value,"cubic units");
  }
 case "ellipsoid-volume-calculator": {
    const a=w11Parse(input,3,"Ellipsoid Volume");
    if(!(a.every(x=>x>0)))throw Error("Ellipsoid Volume input out of domain. Expected semi-axis A | semi-axis B | semi-axis C");
    const value=4*Math.PI*a[0]*a[1]*a[2]/3;
    return w11Result("Ellipsoid Volume",value,"cubic units");
  }
 case "annulus-area-calculator": {
    const a=w11Parse(input,2,"Annulus Area");
    if(!(a[0]>a[1]&&a[1]>=0))throw Error("Annulus Area input out of domain. Expected outer radius | inner radius");
    const value=Math.PI*(a[0]**2-a[1]**2);
    return w11Result("Annulus Area",value,"square units");
  }
 case "hollow-cylinder-material-volume": {
    const a=w11Parse(input,3,"Hollow Cylinder Material Volume");
    if(!(a[0]>a[1]&&a[1]>=0&&a[2]>0))throw Error("Hollow Cylinder Material Volume input out of domain. Expected outer radius | inner radius | height");
    const value=Math.PI*(a[0]**2-a[1]**2)*a[2];
    return w11Result("Hollow Cylinder Material Volume",value,"cubic units");
  }
 case "regular-polygon-apothem-calculator": {
    const a=w11Parse(input,2,"Regular Polygon Apothem");
    if(!(Number.isSafeInteger(a[0])&&a[0]>=3&&a[0]<=100000&&a[1]>0))throw Error("Regular Polygon Apothem input out of domain. Expected number of sides | side length");
    const value=a[1]/(2*Math.tan(Math.PI/a[0]));
    return w11Result("Regular Polygon Apothem",value,"units");
  }
 case "regular-polygon-circumradius": {
    const a=w11Parse(input,2,"Regular Polygon Circumradius");
    if(!(Number.isSafeInteger(a[0])&&a[0]>=3&&a[0]<=100000&&a[1]>0))throw Error("Regular Polygon Circumradius input out of domain. Expected number of sides | side length");
    const value=a[1]/(2*Math.sin(Math.PI/a[0]));
    return w11Result("Regular Polygon Circumradius",value,"units");
  }
 case "regular-polygon-perimeter": {
    const a=w11Parse(input,2,"Regular Polygon Perimeter");
    if(!(Number.isSafeInteger(a[0])&&a[0]>=3&&a[0]<=100000&&a[1]>0))throw Error("Regular Polygon Perimeter input out of domain. Expected number of sides | side length");
    const value=a[0]*a[1];
    return w11Result("Regular Polygon Perimeter",value,"units");
  }
 case "ellipse-circumference-ramanujan": {
    const a=w11Parse(input,2,"Ellipse Circumference (Ramanujan)");
    if(!(a[0]>=a[1]&&a[1]>0))throw Error("Ellipse Circumference (Ramanujan) input out of domain. Expected semi-major axis | semi-minor axis");
    const value=Math.PI*(3*(a[0]+a[1])-Math.sqrt((3*a[0]+a[1])*(a[0]+3*a[1])));
    return w11Result("Ellipse Circumference (Ramanujan)",value,"units");
  }
 case "right-cone-slant-height": {
    const a=w11Parse(input,2,"Right Cone Slant Height");
    if(!(a.every(x=>x>0)))throw Error("Right Cone Slant Height input out of domain. Expected base radius | perpendicular height");
    const value=Math.hypot(a[0],a[1]);
    return w11Result("Right Cone Slant Height",value,"units");
  }
 case "vector3-dot-product-calculator": {
    const a=w11Parse(input,6,"3D Vector Dot Product");
    if(!(a.every(Number.isFinite)))throw Error("3D Vector Dot Product input out of domain. Expected Ax | Ay | Az | Bx | By | Bz");
    const value=a[0]*a[3]+a[1]*a[4]+a[2]*a[5];
    return w11Result("3D Vector Dot Product",value,"squared vector units");
  }
 case "vector3-cross-product-magnitude": {
    const a=w11Parse(input,6,"3D Cross Product Magnitude");
    if(!(a.every(Number.isFinite)))throw Error("3D Cross Product Magnitude input out of domain. Expected Ax | Ay | Az | Bx | By | Bz");
    const value=Math.hypot(a[1]*a[5]-a[2]*a[4],a[2]*a[3]-a[0]*a[5],a[0]*a[4]-a[1]*a[3]);
    return w11Result("3D Cross Product Magnitude",value,"squared vector units");
  }

 default:return null;
}}
