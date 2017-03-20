function [F,V] = MarchingCubes(v,s)
%v-voxel,s-isovalue,F-facelists,V-vertices
%use the cube code to get cutted edges(256)
load('table1.mat');
load('table2.mat');
dims = size(v) - 1;
cube_code = zeros(dims(1),dims(2),dims(3),'uint16');
cube_id = {1:dims(1),1:dims(2),1:dims(3)};
vectors = [0,0,0;1,0,0;1,1,0;0,1,0;0,0,1;1,0,1;1,1,1;0,1,1];
%get the 8-bit code of each cube
for i = 1:8
    x = cube_id{1} + vectors(i,1);
    y = cube_id{2} + vectors(i,2);
    z = cube_id{3} + vectors(i,3);
    id = v(x,y,z) > s;
    cube_code(id) = bitset(cube_code(id),i);
end
edgePort = [0,1;1,2;2,3;0,3;4,5;5,6;6,7;4,7;0,4;1,5;2,6;3,7]+1;
%interpolate vertices and get output V (points list)
V = [];F = [];
iedge = table1(cube_code + 1);
t_id = find(iedge);%get the cube through by isosurface
if(isempty(t_id))
    return;
end
pl = zeros(size(t_id,1), 4, 12);%store the interpolation points with their cube and edge info
t_edge = [t_id iedge(t_id)];
indexCount = 0;
for i=1:12
    t_ida = logical(bitget(t_edge(:,2), i)); % used for logical indexing
    t_idb = t_edge(t_ida, 1);
    [xi, yi ,zi] = ind2sub(size(cube_code), t_idb);%base address for each cube
    p1 = [xi, yi ,zi] + repmat(vectors(edgePort(i,1),:),size(t_idb,1),1);
    p2 = [xi, yi ,zi] + repmat(vectors(edgePort(i,2),:),size(t_idb,1),1);
    id1 = sub2ind(size(v),p1(:,1),p1(:,2),p1(:,3));
    id2 = sub2ind(size(v),p2(:,1),p2(:,2),p2(:,3));
    vp1 = v(id1);  vp2 = v(id2);
    p = zeros(size(t_idb,1),3);%interpolate to get p
    ida = (vp1 == vp2);%condition 1
    if(~isempty(ida))
        p(ida,:) = (p1(ida,:) + p2(ida,:)) / 2;
    end
    idb = (vp1 ~= vp2);%condition 2
    if(~isempty(idb))
        lamda = (s - vp1(idb))./(vp2(idb) - vp1(idb));
        p(idb,:) = p1(idb,:) + repmat(lamda,1,3) .* (p2(idb,:) - p1(idb,:));
    end
    pl(t_ida, 1:4, i) = [p (1:size(t_idb, 1))' + indexCount];%add new getted points
    indexCount = indexCount + size(t_idb, 1);
end
%get the output V from matrix pp
for i = 1:12
    idp = pl(:, 4, i) > 0;
    if any(idp)
        V(pl(idp, 4, i), 1:3) = pl(idp, 1:3, i);
    end
end
%get the output F from matrix pp
triangle = table2(cube_code(t_id)+1, :);
for i=1:3:15
    idt = find(triangle(:, i) > 0);
    if ~isempty(idt)
        p1 = sub2ind(size(pl), idt, 4*ones(size(idt,1),1), triangle(idt,i));
        p2 = sub2ind(size(pl), idt, 4*ones(size(idt,1),1), triangle(idt,i+1));
        p3 = sub2ind(size(pl), idt, 4*ones(size(idt,1),1), triangle(idt,i+2));
        F = [F; pl(p1), pl(p2), pl(p3)];
    end
end
end
