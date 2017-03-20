clc,clear;
f = fopen('mouse0.raw');
A = fread(f,'ushort','b');
n = [150,150,276];
v = zeros(n(1),n(2),n(3));
for i = 0:n(1)-1
    for j = 0:n(2)-1
        for k = 0:n(3)-1
            v(i+1,j+1,k+1) = A(i+j*n(1)+k*n(1)*n(2)+1);
        end
    end
end
[F,V] = MarchingCubes(v,40000);
patch('vertices',V,'faces',F,'edgecolor','none',...
        'facecolor',[0.766 0.766 0.766],'facelighting','phong')
view(0,0);
light
axis equal off

