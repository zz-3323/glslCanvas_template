// Author:CMH
// Title:BreathingGlow+Noise+MouseInteract

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float glow(float d, float str, float thickness){
    return thickness / pow(d, str);
}

vec2 hash2( vec2 x )            //亂數範圍 [-1,1]
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}
float gnoise( in vec2 p )       //亂數範圍 [-1,1]
{
    vec2 i = floor( p );
    vec2 f = fract( p );
    
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( hash2( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                            dot( hash2( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                         mix( dot( hash2( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                            dot( hash2( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float fbm(in vec2 uv)       //亂數範圍 [-1,1]
{
    float f;                                                //fbm - fractal noise (4 octaves)
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
    f   = 0.5000*gnoise( uv ); uv = m*uv;          
    f += 0.2500*gnoise( uv ); uv = m*uv;
    f += 0.1250*gnoise( uv ); uv = m*uv;
    f += 0.0625*gnoise( uv ); uv = m*uv;
    return f;
}

//Gradient Noise 3D
vec3 hash( vec3 p ) // replace this by something better
{
    p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
              dot(p,vec3(269.5,183.3,246.1)),
              dot(p,vec3(113.5,271.9,124.6)));

    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
    vec3 i = floor( p );
    vec3 f = fract( p );
    
    vec3 u = f*f*(3.0-2.0*f);

    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}


float hollowSquare(vec2 uv, float size, float thickness) {
    // 计算方形中心到当前像素点的距离
    vec2 squareCenter = vec2(0.0, 0.0);
    vec2 squareDist = abs(uv - squareCenter);

    // 计算方形的边界
    vec2 squareBounds = vec2(size, size);

    // 计算方形的内部距离
    vec2 insideDist = squareBounds - squareDist;

    // 返回计算得到的距离，实现空心效果
    return length(clamp(insideDist, 0.0, thickness));
}

float mouseEffect(vec2 uv, vec2 mouse, float size)
{
    float dist=length(uv-mouse);
    return 1.2-smoothstep(size*1.9, size, dist);  //size
    //return pow(dist, 0.5);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;
    uv = uv*2.0-1.0;
    vec2 mouse = u_mouse/u_resolution.xy;
    mouse.x *= u_resolution.x/u_resolution.y;
    mouse = mouse*2.0-1.0;

    // 陰晴圓缺
    float pi = 3.14159;
    float theta = 2.0 * pi * u_time / 8.0;
    vec2 point = vec2(sin(theta), cos(theta));
    float dir = dot(point, (uv)) + 0.55;

    // 互動陰晴圓缺
    float interact = 1. - mouseEffect(uv, mouse, 0.35);

    // 亂數作用雲霧
    float fog = fbm(0.4*uv + vec2(-0.1*u_time, -0.02*u_time)) * 0.4 + 0.1;

    /// 定義圓環
    float result = 0.0;
    float thickness=0.05;  // 将 thickness 移到循环体外
    for(float index = 0.0; index < 1.0; ++index) {
        float noise_position = interact;
        float radius_noise = noise(vec3(4.892*uv, index + u_time*0.388)) * 0.280 * noise_position;
        float radius = 0.324 + radius_noise;
        float hollow_square_dist = hollowSquare(uv, radius, thickness);

        float breathing = (exp(sin(u_time/2.0*pi)) - 0.36787944) * 0.42545906412;
        float strength = (0.232*breathing + 0.2);  // [0.2~0.3]
        thickness = (0.112*breathing + 0.050);  // [0.1~0.2]
        
        // 使用空心方形的距离来计算 glow_square
        float glow_square = glow(hollow_square_dist, strength, thickness);
        result += glow_square;
    }
    gl_FragColor = vec4((vec3(result+fog)), 1.0);
    //gl_FragColor = vec4(uv, 0.0, 1.0);
    // gl_FragColor = vec4(vec3(circle_dist), 1.0);
}
