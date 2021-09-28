
// initiates page and selector list


function runApp() {
    // reference: dropdown select element
    var selector = d3.select("#selDataset");
    
    //read JSON and extract names to populate SELECTOR
    d3.json("samples.json").then((categories) => {
        
        //define categories NAMES / METADATA / SAMPLES
        var names = categories.names;
        var metadata = categories.metadata;
        var samples = categories.samples;
        const firstSample = metadata[0];
        
        //populate SELECTOR with NAMES 
        Object.values(names).forEach(samples => {
            selector.append("option").text(samples).property("value", samples);
        });
        buildMetadata(firstSample);
        buildCharts(firstSample);
    });                  
}


function optionChanged(input) {
// This function runs when option box is changed. It matches input and returns metadata information.
    
    sample_metadata = d3.select("#sample-metdata").remove();
    // Use *.html("") to clear any existing metadata
    sample_metadata.html(""); 
    
    var index =0; 
    d3.json("samples.json").then((categories) => {
        
        //define categories NAMES / METADATA / SAMPLES and other vars
        var names = categories.names;
        var metadata = categories.metadata;
        var samples = categories.samples;
        const firstSample = metadata[0];
        var inputID = input;
        
        //Search for index that matches input (input is metadata.id number)
        Object.values(metadata).forEach((md,i) => {
            if(md.id == inputID){
                index = i;
            }
        });
    
    // create constant that will send buildMetadata / buildCharts functions with metadata information that matches input
    const sample = metadata[index];
    
    // runs following functions with SAMPLE metadata information
    buildMetadata(sample);
    buildCharts(sample);
    });    
}                              

function buildMetadata(input){
// This function populates Demographic info box that matches input
    
    //Select #sample-metadata HTML element
    var sample_metadata = d3.select("#sample-metadata");

    //Clear any old Metadata
    sample_metadata.selectAll("p").remove();
    
    //Building METADATA
    data = d3.json("samples.json").then(function(data) {    
        var names = data.names;
        var metadata = data.metadata;
        var samples = data.samples;
        var index = 0;
        var i =0;
        var inputID = input.id;
        
        //Tranverse metadata to match input and return index number
        Object.values(metadata).forEach((md,i) => {
            if(md.id == inputID){
                index = i;
            }  
        });
        
        // Use `Object.entries` to add each key and value pair to the panel
        // Inside the loop, use d3 to append new tags for each key-value in metadata
        for(let [key1, value1] of Object.entries(metadata[index])){
                sample_metadata.append("p").text(`${key1}: ${value1}`);
        }
    });       
}        

function buildCharts(input) {
    var index = 0;
    var sample
    d3.json("samples.json").then(function (data) {
        console.log("buildChart():", data);
        var samples = data.samples;
        
        
        samples.forEach(function(response,i){
        //             console.log(response);
            if(response.id == input.id){
                index = i;
            
            
                var topTenSampleValues = response.sample_values.sort(function(a,b){return b-a})
                // console.log(topTenSampleValues)
                topTenSampleValues = topTenSampleValues.slice(0,10);
                
                
                var topTenOtuIDS = response.otu_ids.slice(0,10);
                var topTenLabel = response.otu_labels

                // BAR CHART
                var barchartData = [{
                x: topTenSampleValues,
                y: topTenOtuIDS,
                orientation: 'h',
                type : "bar"
                }];

                var layout = {
                height: 600,
                width: 800,
                yaxis:{
                    type: 'category'
                }
                };

                Plotly.newPlot("bar",barchartData,layout)
                
                // BUBBLE CHART
                var otuID = response.otu_ids;
                var sampleValues = response.sample_values;
                var otuLabels = response.otu_labels;
          
                // console.log(otuID);
                // console.log(sampleValues);
                
                
                var bubblechartData = [{
                    x: otuID,
                    y: sampleValues,
                    text: otuLabels,
                    marker: {
                        size: response.sample_values,
                        color: response.otu_ids,
                    },
                    // type: 'scatter',
                    mode: 'markers'
                }];
        
           
                var layout1 = {
                    height: 600,
                    width: 800
                };
                Plotly.newPlot("bubble", bubblechartData, layout1);      
            }
        });
    });
}


// runApp() called when browser loads
runApp();