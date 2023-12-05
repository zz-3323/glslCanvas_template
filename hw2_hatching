//YI-LAN LIN
//20231129
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;//MonaLisa.jpg
uniform sampler2D u_tex1;//hatch_1.jpg
uniform sampler2D u_tex2;//hatch_1.jpg
uniform sampler2D u_tex3;//hatch_2.jpg
uniform sampler2D u_tex4;//hatch_3.jpg
uniform sampler2D u_tex5;//hatch_4.jpg
uniform sampler2D u_tex6;//hatch_5.jpg
uniform sampler2D u_tex7;//angry.jpg
uniform sampler2D u_tex8;//rainbow.jpg


float breathing=(exp(sin(u_time*2.0*3.14159/8.0)) - 0.36787944)*0.42545906412;//呼吸效果
/*
float mouseEffect(vec2 uv, vec2 mouse, float size)//vec2 uv(both between 0~1), vec2 mouse(both between 0~1)加上size
{
    float dist=length(uv-mouse);//像素到游標距離(0~根號2?)
    return smoothstep(size, size+0.2*(breathing+0.5), dist); //(0~1, 0~1, 0~1)
    //界線值為size及size+0.2*(breathing+0.5)，插入值dist
    //mouseEffect 函数的返回值将在 0.0 和 1.0 之间平滑地过渡
    //size為0.05(在下面的void main)
}
*/


void main()
{
    vec2 uv= gl_FragCoord.xy/u_resolution.xy;//當前像素螢幕座標/當前像素解析度座標，此值介於0~1之間
    vec2 vUv=fract(20.0*uv);//key，此值介於0~1之間，取小數，常數越大紋理越細緻(why)
    vec4 shadeColor= texture2D(u_tex7, uv); //取angry.jpg
    float shading= shadeColor.g;            //g=green, 取angry.jpg綠色版作為明亮值(0~1)
    vec2 mouse=u_mouse.xy/u_resolution.xy;//當前游標螢幕座標/當前游標解析度座標，此值介於0~1之間
    
    //float value=mouseEffect(uv,mouse,0.05);//mouseEffect 函数的返回值将在 0.0 和 1.0 之间平滑地过渡
    
    //float remappedXCoords = u_mouse.x/1920.0;//remap滑鼠x值成0~1
    vec2 remappedXYCoords = vec2(u_mouse.x/1920.0, u_mouse.y/1080.0);//remap滑鼠xy值成0~1

    float mousedist = length(uv-mouse);
    

    // 根据明亮度值进行颜色混合
    vec4 c;
                float step = 1. / 6.;//定義著色閾值，1/6約等於0.16...
                if( shading <= step )//if明度<=0.16
                {   
                    c = mix( texture2D( u_tex6, vUv ), texture2D( u_tex5, vUv ), 6. * shading );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( shading > step && shading <= 2. * step )//if 0.16<明度>0.33
                {
                    c = mix( texture2D( u_tex5, vUv ), texture2D( u_tex4, vUv) , 6. * ( shading - step ) );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( shading > 2. * step && shading <= 3. * step )//if 0.33<明度>0.5
                {
                    c = mix( texture2D( u_tex4, vUv ), texture2D( u_tex3, vUv ), 6. * ( shading - 2. * step ) );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( shading > 3. * step && shading <= 4. * step )//if 0.5<明度>0.66
                {
                    c = mix( texture2D( u_tex3, vUv ), texture2D( u_tex2, vUv ), 6. * ( shading - 3. * step ) );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( shading > 4. * step && shading <= 5. * step )//if 0.66<明度>0.83
                {
                    c = mix( texture2D( u_tex2, vUv ), texture2D( u_tex1, vUv ), 6. * ( shading - 4. * step ) );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( shading > 5. * step )//if明度>0.83
                {
                    c = mix( texture2D( u_tex1, vUv ), vec4( 1. ), 6. * ( shading - 5. * step ) );//vec4(1.)==vec4(1., 1., 1., 1.,)也就是白色//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
/*
    vec4 morehatching;
    			float step = 1. / 6.;
    			if( mousedist <= step )//if明度<=0.16
                {   
                    c = mix( texture2D( u_tex6, vUv ), texture2D( u_tex5, vUv ), 6. * mousedist );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( mousedist > step && mousedist <= 2. * step )//if 0.16<明度>0.33
                {
                    c = mix( texture2D( u_tex5, vUv ), texture2D( u_tex4, vUv) , 6. * ( mousedist - step ) );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( mousedist > 2. * step && mousedist <= 3. * step )//if 0.33<明度>0.5
                {
                    c = mix( texture2D( u_tex4, vUv ), texture2D( u_tex3, vUv ), 6. * ( mousedist - 2. * step ) );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( mousedist > 3. * step && mousedist <= 4. * step )//if 0.5<明度>0.66
                {
                    c = mix( texture2D( u_tex3, vUv ), texture2D( u_tex2, vUv ), 6. * ( mousedist - 3. * step ) );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( mousedist > 4. * step && mousedist <= 5. * step )//if 0.66<明度>0.83
                {
                    c = mix( texture2D( u_tex2, vUv ), texture2D( u_tex1, vUv ), 6. * ( mousedist - 4. * step ) );//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
                if( mousedist > 5. * step )//if明度>0.83
                {
                    c = mix( texture2D( u_tex1, vUv ), vec4( 1. ), 6. * ( mousedist - 5. * step ) );//vec4(1.)==vec4(1., 1., 1., 1.,)也就是白色//mix(vec4取樣像素顏色, vec4取樣像素顏色, 0~1之間的權重)
                }
*/

    // 使用混合后的颜色值进行最终的混合           
    //vec4 inkColor = vec4(0.0, 0.0, 1.0, 1.0);//藍色
    vec4 inkColor = texture2D(u_tex8, remappedXYCoords);
     
    vec4 src = mix( mix( inkColor, vec4(1.), c.r ), c, .5 );//mix(mix(vec4 藍色，vec4 白色，vec4 c.紅色版), vec4已混顏色, 權重0.5)==mix(vec4 藍白紅, vec4已混顏色, 權重0.5))==vec4某色
    
    //vec4 AddMouseEffect = mix(src, morehatching, 0.5);
    //vec4 mixColor = mix(shadeColor, src, value);//mix(vec4 angry.jpg顏色, vec4 hatching顏色, 權重由游標距離決定)
    //vec4 mixColor = mix(shadeColor, src, 0.5);//for testing
	vec4 mixColor = mix(shadeColor, src, remappedXYCoords.x);//mix(vec4 angry.jpg顏色, vec4 hatching顏色, 權重由游標x值決定)
	//vec4 mixColor = mix(shadeColor, AddMouseEffect, remappedXYCoords.x);//mix(vec4 angry.jpg顏色, vec4 hatching顏色, 權重由游標x值決定)
     
    // 将最终的混合颜色输出
    gl_FragColor = mixColor;
    //gl_FragColor = inkColor;


}
