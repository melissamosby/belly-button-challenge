function init(){
    d3.json("/data/samples.json").then(function(jsonData) {
        d3.select("#selDataset")
            .selectAll("option")
            .data(jsonData.names)
            .enter()
            .append("option")
            .text(d=>d)
            .attr("value",d=>d);

        exec(d3.select("#selDataset").property("value"));
    });
}

function exec(num){
    console.log("asd")
    d3.json("/data/samples.json").then(function(jsonData) {
        var metadata = jsonData.metadata.filter(data => data.id ==num);
        var sample = jsonData.samples.filter(data => data.id ==num);

        var bar_arg1 = sample[0].sample_values.slice(0,10).reverse();
        var bar_arg2 = sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a)
        var bar_arg3 = sample[0].otu_labels.slice(0,10).reverse()

        CreateBar(bar_arg1, bar_arg2, bar_arg3);

        var bub_arg1 = sample[0].otu_ids;
        var bub_arg2 = sample[0].sample_values;
        var bub_arg3 = sample[0].otu_labels;

        CreateBubble(bub_arg1,bub_arg2,bub_arg3);
        var div = d3.select("#sample-metadata");
        
        div.html("")
        var list = div.append("ul");
        Object.entries(metadata[0]).forEach(([key, value]) => {
            list.append("li").text(key + ": " + value);
         });

        CreateGauge(metadata[0].wfreq);
    });
}

function CreateBar(text,x,y){
    var bar_data = [{type: 'bar', x:x, y:y, text:text, orientation: 'h'}];
    var layout = {showlegend: false,};
    Plotly.newPlot('bar', bar_data, layout);
}

function CreateBubble(text,x,y){
    var Bubble_data = [{x: x,y: y,text: text,mode: 'markers',marker: {size: y,olor: x.map(value=>value)}}];
    var layout = {title: "",xaxis: {title: {text: 'OTU ID',}}};
    Plotly.newPlot('Bubble', Bubble_data, layout);
}
 function CreateGauge(id){
    const step_array = ['#FFFFFF', '#FF7456', '#FF8E75', '#FFAE9B', '#FFEAE5']
    
    var gauge_data = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: id,
        title: "Weekly Belly Button Washing Frequency",
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10]},
            bar: { color: "#000000" },
            steps: [
                { range: [0, 2], color: step_array[0]},
                { range: [2, 4], color: step_array[1]},
                { range: [4, 6], color: step_array[2]},
                { range: [6, 8], color: step_array[3]},
                { range: [8, 10], color:step_array[4]},
            ],
        }
    }];
    Plotly.newPlot('gauge', gauge_data);
}

init();