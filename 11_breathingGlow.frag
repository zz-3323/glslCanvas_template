#ifdef GL_ES 
precision mediump float; 
#endif 

uniform vec2 u_resolution;  // Canvas size (width,height)
uniform vec2 u_mouse;       // mouse position in screen pixels
uniform float u_time;       // Time in seconds since load

float glow(float d, float str, float thickness) 
{ 
    return thickness / pow(d, str);
}

// 定義形狀的參數 
float dot2( in vec2 v )
{ 
    return dot(v,v); 
}

float sdHeart( in vec2 p )
{
    p.x = abs(p.x);

    if( p.y+p.x>1.0 )
        return sqrt(dot2(p-vec2(0.25,0.75))) - sqrt(2.0)/4.0;
    return sqrt(min(dot2(p-vec2(0.00,1.00)),
                    dot2(p-0.5*max(p.x+p.y,0.0)))) * sign(p.x-p.y);
}


float fbm(in vec2 uv) 

{ 
    float f;
 // fbm - fractal noise (4 octaves) 
 mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
 f = 0.5000 * sdHeart(uv);
 uv = m * uv; f += 0.2500 * sdHeart(uv);
 uv = m * uv; f += 0.1250 * sdHeart(uv); 
 uv = m * uv; f += 0.0625 * sdHeart(uv);
 return f;
} 

void main()
{ 
    vec2 uv = gl_FragCoord.xy / u_resolution.xy; uv.x *= u_resolution.x / u_resolution.y; 
    uv = uv * 2.968 - 1.096;
    // 背景霧效果 
    float fog = fbm(0.4 * uv + vec2(-0.1 * u_time, -0.02 * u_time)) * 0.6 + 0.1;
    // 使用距離場計算光暈效果 
    float dist = sdHeart(uv); 
    // 動態呼吸效果 
    float breathing = (exp(sin(u_time / (2.0 * 3.14159))) - 0.36787944) * 0.42545906412;
    float strength = (0.060 * breathing + 0.1); float thickness = (0.1 * breathing + 0.1); 
    float glow_circle = glow(dist, strength, thickness); 
    gl_FragColor = vec4((vec3(glow_circle) + fog) * vec3(0.559,0.971,1.000), 0.720); 
}
