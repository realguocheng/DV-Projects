/*treemap对象的构造器函数，
	算法：squarified treemap
	作用对象：一个矩形的下一级的所有结点
	~通过迭代调用完成所有叶节点的绘制~
*/
function Treemap(context)
{
	//参数初始化
    var overallSize = {width:0, height:0}		//整个绘制面积
    var currentOffset = {x:0, y:0};				//当前偏移（布局左上角坐标）
    var currentSize = {width:0, height:0, area:0}//当前工作区域大小row
    var remainingTilesArea = [];				//未使用区域大小
    var rectangles = [];						//参访所有即将要绘制的矩形
    var colors = [];							//存储不同级别数据的颜色


	//求解在当前row的所有面积中最大的比率-有公式
    function worstRatio(areas, length)
    {
        var worstRatio;

        if (areas.length == 0) {
            worstRatio = 999999;
        } else {
            var areaMin = Math.min.apply(null, areas);
            var areaMax = Math.max.apply(null, areas);
            var areaSum = listSum(areas);
            //同时求出长宽比或者宽长比，即不用考虑那条边是长边
            var ratioOne = (length*length*areaMax) / (areaSum*areaSum);
            var ratioTwo = (areaSum*areaSum) / (length*length*areaMin);
            
            worstRatio = Math.max.apply(null, [ratioOne, ratioTwo]);
        }

        return worstRatio;
    }


	//正方化的递归调用
    function squarify(children, row)
    {
        if (children.length > 0) {
            var length = lengthOfShortestSide();
            var head = children.slice(0, 1);
            var tail = children.slice(1);
            var rowWithChild = row.concat(head);//row拼接children的第一个元素

			//若长宽比率降低则在当前row添加矩形，否则新建row
            if (worstRatio(row, length) >= worstRatio(rowWithChild, length)) {
                squarify(tail, rowWithChild);
            } else {
                layoutRow(row);
                squarify(children, []);
            }
        } else {
            layoutRow(row);
        }
    }


	//数组累加
    function listSum(list)
    {
        if (list.length == 1) {
            sum = list[0];
        } else {
            sum = list.reduce(function(previous, current) {
                return previous+current;
            });
        }

        return sum;
    }


	//判断矩形的那一条边最短，用于分割
    function shortestSide()
    {
        var side;

        if (currentSize.width >= currentSize.height) {
            side = 'height';
        } else {
            side = 'width';
        }

        return side;
    }


	//返回最短边的具体长度
    function lengthOfShortestSide()
    {
        var length;

        if (currentSize.width >= currentSize.height) {
            length = currentSize.height;
        } else {
            length = currentSize.width;
        }

        return length;
    }


	//向初始化的变量中填写具体参数
    function layoutRow(row)
    {
        var tempOffset;

        if (shortestSide() == 'height') {

            // 计算当前row的布局信息
            var rowArea = sumRow(row);
            var rowAreaPercentage = rowArea / remainingTilesArea;
            var layoutWidth = Math.round(currentSize.width * rowAreaPercentage);
            var tempHeight = lengthOfShortestSide();
            tempOffset = currentOffset.y;

            while (row.length > 0) {

                // 计算当前区域中的所有矩形的位置信息并存储
                var elementArea = row[0];
                var elementAreaPercentage = elementArea / sumRow(row);
                var elementHeight = Math.round(tempHeight * elementAreaPercentage);
                var x1 = currentOffset.x;
                var y1 = tempOffset;
                var x2 = x1 + layoutWidth - 1;
                var y2 = y1 + elementHeight - 1;
                rectangles[rectangles.length] = {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2};

                //为下次迭代做准备
                tempHeight = tempHeight - elementHeight;
                tempOffset = tempOffset + elementHeight;
                row.shift();
            }
			//更新全局变量
            currentOffset.x = currentOffset.x + layoutWidth;
            currentSize.width = currentSize.width - layoutWidth;
            currentSize.area = currentSize.width * currentSize.height;
            remainingTilesArea = remainingTilesArea - rowArea;

        } else {

           // 计算当前row的布局信息
            var rowArea = sumRow(row);
            var rowAreaPercentage = rowArea / remainingTilesArea;
            var layoutHeight = Math.round(currentSize.height * rowAreaPercentage);
            var tempWidth = lengthOfShortestSide();
            tempOffset = currentOffset.x;

            while (row.length > 0) {

                // 计算当前区域中的所有矩形的位置信息并存储
                var elementArea = row[0];
                var elementAreaPercentage = elementArea / sumRow(row);
                var elementWidth = Math.round(tempWidth * elementAreaPercentage);
                var x1 = tempOffset;
                var y1 = currentOffset.y;
                var x2 = x1 + elementWidth - 1;
                var y2 = y1 + layoutHeight - 1;
                rectangles[rectangles.length] = {x1: x1, y1: y1, x2: x2, y2: y2};

               //为下次迭代做准备
                tempWidth = tempWidth - elementWidth;
                tempOffset = tempOffset + elementWidth;
                row.shift();
            }
			//更新全局变量
            currentOffset.y = currentOffset.y + layoutHeight;
            currentSize.height = currentSize.height - layoutHeight;
            currentSize.area = currentSize.width * currentSize.height;
            remainingTilesArea = remainingTilesArea - rowArea;
        }

    }


	//当前row中的所有长方形面积的总和
    function sumRow(row)
    {
        if (row.length == 0) {
            sum = 0;
        } else {
            if (row.length == 1) {
                sum = row[0];
            } else {
                sum = row.reduce(function(previous, current) {
                    return previous+current;
                });
            }
        }

        return sum;
    }

	 //返回所有长方形的实际显示大小
    function normalize(list)
    {
        var normalizedList = [];
        var overallArea = overallSize.width * overallSize.height;
        var sum = sumRow(list);

        list.forEach(function(element) {
            var normalizedElement = (element / sum) * overallArea;
            normalizedList.push(normalizedElement);
        });

        return normalizedList;
    }


	//启动绘制过程
    function map(list)
    {
        normalizedList = normalize(list);
        squarify(normalizedList, [], lengthOfShortestSide());
    }

	//颜色选择函数
	function color(level)
	{
		if(level == 1)
			return "#FB8761";
		else if(level == 2)
			return "#FEC287";
		else if(level == 3)
			return "#FCFDBF";
	}

	//在网页上开始绘制treemap, 依据之前求解出来的分布（layoutRow）
    function drawRectangle(l)
    {
        var rectangle = rectangles.shift();
        var width = rectangle.x2-rectangle.x1+1;
        var height = rectangle.y2-rectangle.y1+1;
        var hue = colors.shift();

        context.beginPath();
        context.rect(rectangle.x1+2, rectangle.y1+2, width-2, height-2);
        context.fillStyle = color(l);
        context.fill();

        if (rectangles.length > 0) {
            setTimeout(function() {drawRectangle()}, 100);
        }
    }


	//treemap对象调用draw启动整个工作流程
    this.draw = function(data, x1, y1, x2, y2, l)
    {

        rectangles = [];
		
		var width = x2 - x1 + 1;
		var height = y2 - y1 + 1;
		
        overallSize = {
            width: width,
            height: height
        };

        currentSize = {
            width: width,
            height: height,
            area: width * height
        };

        currentOffset = {
            x: x1,
            y: y1
        };

        remainingTilesArea = currentSize.area;

   
        map(data);
		var rects = rectangles.slice(0,rectangles.length);//获取所有的矩阵信息用于返回
        drawRectangle(l);
			
		return rects;
    }
};
