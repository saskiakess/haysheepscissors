// Hay, sheep and scissors v0
// Author: Saskia Keskpaik
// saskia.keskpaik@gmail.com

// for review

 
window.onload = function(){


    var p = Raphael("paper", 800, 800)
    var xmax = 600;
    var ymax = 500;


    // Put everything in a function to be able to re-initialize


    // Draw interface 

    function itemInit (){ 
 
        // Interface: rectangle divided into menu bar and working space
        p.rect(0, 0, xmax, ymax, 10)
            .attr({
                "stroke-width": 0.5,
                "fill": "#d2f4bc"
            });
        // Line separating menu and working space 
        var linePanes = p.path("M 100,0 L 100,500").
            attr({
                "stroke-width": 0.5
            });
        // Title for menu 
        p.text(50, 20, "Menu")
            .attr({
                "font-family": "Georgia",
                "font-size": 18,
                fill: "#424f4f"
            });
        // Title for working space
        p.text(xmax/2, 20, "Plan du travail")
            .attr({
                "font-size": 22, 
                fill: "#424f4f"
            });


        // Import icons

        window.haybale = p.image("img/haybale.png", 10, 60, 70, 70);
        window.sheep = p.image("img/sheep.png", 10, 150, 80, 60);
        window.scissors = p.image("img/scissors.png", 10, 230, 70, 50);    


        // Draw the reset button 

        p.setStart();

                p.rect(10, 460, 80, 30, 1)
                    .attr({
                        fill: "#4c4cff", 
                        stroke: 1, 
                        "stroke-width": 0.6, 
                        cursor: "pointer"
                    });
                p.text(50,475,"Recommencer")
                    .attr({
                        fill: "white",
                        "font-size": 12, 
                        cursor: "pointer"
                    });

        window.resetbtn = p.setFinish();
    

        // Define reset function

        resetbtn.click(function () {
            p.clear();
            itemInit();
        });


        // Drag and drop

        var move = function(dx, dy){ 
                // Limit drag and drop movements to the workspace 
                if (this.attr("x") > 520 || this.attr("y") > 420)
                    this.attr({x: this.ox+dx, y: this.oy+dy}); 
                else{
                    nowX = Math.min(520, this.ox + dx);
                    nowY = Math.min(420, this.oy + dy);
                    nowX = Math.max(10, nowX);
                    nowY = Math.max(10, nowY);   
                    this.attr({x: nowX, y: nowY });
                }
            },
            start = function(x, y){ 
                this.ox=this.attr("x"); 
                this.oy=this.attr("y");
                // Create global variable (= the object being dragged)
                window.draggedObj = this;

            },  
            end = function(){ 
                // Keep item drop out of menu bar, except for the scissors 
                if(this.attr("src") == "img/scissors.png" || this.attr("x") < 100){
                    this.attr({x: this.ox, y: this.oy});
                };
                delete window.draggedObj;
            };


        // Make a clone of the icon
        var clonehandler = function() {       
            var x = this.clone();
            x.drag(move,start,end).onDragOver(function(hoveredObj){ collide(hoveredObj);});
        };


        // Interactions: 
        function collide(hoveredObj) {
            // Limit interactions to the workspace (no interaction inside the menu bar)
            if(hoveredObj.attr("x") > 100){
                // if sheep touches haybale or if scissors touch haybale -> only some hay left
                if((window.draggedObj.attr("src") == "img/sheep.png" || window.draggedObj.attr("src") == "img/scissors.png") && hoveredObj.attr("src") == "img/haybale.png") {
                    p.image("img/hay.png", hoveredObj.attr("x"), hoveredObj.attr("y"), 70, 30);
                    hoveredObj.remove();
                // if scissors touch sheep -> sheep looses its wool
                } else if (window.draggedObj.attr("src") == "img/scissors.png" && hoveredObj.attr("src") == "img/sheep.png"){
                    p.image("img/sheepsheared.png", hoveredObj.attr("x"), hoveredObj.attr("y"), 80, 60).drag(move,start,end).onDragOver(function(hoveredObj){ collide(hoveredObj);});
                    hoveredObj.remove();
                // if sheared sheep touches haybale -> sheep gets its wool back
                } else if (window.draggedObj.attr("src") == "img/sheepsheared.png" && hoveredObj.attr("src") == "img/haybale.png"){
                    p.image("img/sheep.png", window.draggedObj.attr("x"), window.draggedObj.attr("y"), 80, 60).drag(move,start,end).onDragOver(function(hoveredObj){ collide(hoveredObj);});
                    hoveredObj.remove();
                    window.draggedObj.hide();
                };
            };
        };

        haybale.mouseover(clonehandler);
        sheep.mouseover(clonehandler);
        scissors.mouseover(clonehandler);

    };

    itemInit();


// Problems, further developments: 
// how to keep the dragged item always on top? (because of svg, not possible to manipulate the css z-index)
// how to avoid Raphael.js error msg that I get when dragging an item and removing it at the same time? (functionality not altered though)

};
