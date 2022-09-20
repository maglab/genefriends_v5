const _ = require('lodash')
const $ = require('jquery')
const data = require('./records_3.json')

// Given that and Ensembl ID has the following structure ENS(species)(object type)(identifier), 
//     this function takes is and returns an integer based on the identifier (without considering leading zeros) and the object's type (by using a bijection
//     between letters (G, T, R, etc.) and integers). See https://www.ensembl.org/info/genome/stable_ids/prefixes.html
export const nodeId = (ensemblid) => {
    if (ensemblid.includes("ENS") || ensemblid.includes("WBGene") || ensemblid.includes("FBgn")) {
        let cod = ensemblid.replace(/^\D+/g, '').replace(/^0+/, '')
        return parseInt(cod)
    } else {
        return data.find(d => d.ensemblid === ensemblid).nodeidentifier
    }
}

// This function takes two nodeId()'s and, disregarding order, returns a unique identifier (integer) by using the following bijection:
// https://cs.stackexchange.com/questions/57262/compressing-two-integers-disregarding-order
// Which, to be fair, it is witchcraft
export const edgeId = (n0, n1) => {
    let edgeidentifier = 0
    if (n0 < n1) {
        edgeidentifier = (n1) * (n1 - 1) / 2 + n0
    } else {
        edgeidentifier = (n0) * (n0 - 1) / 2 + n1
    }
    return edgeidentifier
}

export const ensemblid = (_nodeidentifier, _species, _tissue) => {
  if (_species != "SCER") {
    _tissue = _tissue.replace(/\d+/g, '') // Extract just the object type (i.e., G or T)
    _nodeidentifier = _nodeidentifier.toString().padStart(11, "0") // Get the numeric part of an ENSEMBL ID based on the nodeidentifier
    return _species + _tissue + _nodeidentifier // Rebuild the ENSEMBL ID
  } else {
      return data.find(d => d.nodeidentifier === _nodeidentifier).ensemblid;
  }
}

export const formatNode = (rows) => {
    rows = rows.split(/\r?\n/)
    rows = rows.map(x => _.split(x, '\t'))
    let result = rows.map((item) => {
        return {
            ensemblid: item[0],
            nodeidentifier: nodeId(item[0]),
            chromosomename: item[1],
            start: parseInt(item[2]),
            end: parseInt(item[3]),
            symbol: item[4],
            biotype: item[5],
            annotation: item[6]
        }
    })
    return result
}

function precise(x, p) {
  return Number.parseFloat(x).toPrecision(p);
}

function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

export const colorDict = (_group, _selectedGroup) => {

  let biotypeDict = {
    antisense:"#c0392b",
    IG_C_gene:"#e74c3c",
    IG_J_gene:"#9b59b6",
    IG_LV_gene:"#2980b9",
    IG_V_gene: "#502c3e",
    IG_V_pseudogene:"#1abc9c",
    lincRNA:"#27ae60",
    lncRNA: "#2ecc71",
    miRNA:"#f1c40f",
    misc_RNA:"#f39c12",
    Mt_rRNA:"#e67e22",
    Mt_tRNA:"#d35400",
    novel:"#34495e",
    polymorphic_pseudogene:"#2c3e50",
    processed_pseudogene: "#CCCCFF",
    processed_transcript: "#2c2c50",
    protein_coding: "#3498db",
    pseudogene: "#502c2c",
    ribozyme: "#502c50",
    rRNA: "#3d502c",
    scaRNA: "#2c502d",
    sense_intronic: "#2c503f",
    sense_overlapping: "#502c36",
    snoRNA: "#50342c",
    snRNA: "#50462c",
    TEC: "#48502c",
    TR_C_gene: "#6ca627",
    TR_D_gene: "#a6a127",
    TR_J_gene: "#a127a6",
    TR_J_pseudogene: "#5215a8",
    TR_V_gene: "#a8156b",
    TR_V_pseudogene: "#a81522",
    transcribed_processed_pseudogene: "#a85215",
    transcribed_unitary_pseudogene: "#a89b15",
    transcribed_unprocessed_pseudogene: "#2547a1",
    unitary_pseudogene: "#4125a1",
    unprocessed_pseudogene: "#0a5fa4"
  }

  let chromosomeDict = {
    c1:"#e74c3c",
    c2:"#9b59b6",
    c3:"#2980b9",
    c4: "#502c3e",
    c5:"#1abc9c",
    c6:"#27ae60",
    c7: "#2ecc71",
    c8:"#f1c40f",
    c9:"#f39c12",
    c10:"#e67e22",
    c11:"#d35400",
    c12:"#34495e",
    c13:"#2c3e50",
    c14: "#CCCCFF",
    c15: "#2c2c50",
    c16: "#3498db",
    c17: "#502c2c",
    c18: "#502c50",
    c19: "#3d502c",
    c20: "#0a5fa4",
    c21: "#2c503f",
    c22: "#502c36",
    c23: "#50342c",
    c24: "#50462c",
    cx: "#48502c",
    cy: "#6ca627"
  }

  if (_selectedGroup === 'biotype'){
    return biotypeDict[_group]
  } else {
    return chromosomeDict['c'+_group]
  }  
}


export const buildNetworkStructure = async (_fetchedData, _seedGenes, _selectedGroup) => {

    let sources = _fetchedData.map(_n => {
        return {
            name: _n.symbol_source,
            chromosome: _n.chromosome_source,
            biotype: _n.biotype_source,
            id: _n.id_source
        }
    })

    let targets = _fetchedData.map(_n => {
        return {
            name: _n.symbol_target,
            chromosome: _n.chromosome_target,
            biotype: _n.biotype_target,
            id: _n.id_target
        }
    })

    let nodes = _.unionBy(sources, targets, 'id')

    for (let i=0; i<nodes.length; i++) {
      if (_seedGenes.includes(nodes[i].id)) {
        nodes[i]['normal'] = { 
          shape: "star5",
          height: 40,
          fill: colorDict(nodes[i][_selectedGroup], _selectedGroup),
          stroke: null
        }
        nodes[i]['hovered'] = { 
          shape: "star5",
          height: 45,
          fill: "white",
          stroke: "3 black"
        }
        nodes[i]['selected'] = { 
          shape: "star5",
          height: 45,
          fill: colorDict(nodes[i][_selectedGroup], _selectedGroup),
          stroke: "3 black"
        }
      } else {
        nodes[i]['normal'] = { 
          shape: "circle",
          fill: colorDict(nodes[i][_selectedGroup], _selectedGroup),
          stroke: null
        }
        nodes[i]['hovered'] = { 
          shape: "circle",
          fill: "white",
          stroke: "3 black"
        }
        nodes[i]['selected'] = { 
          shape: "circle",
          fill: colorDict(nodes[i][_selectedGroup], _selectedGroup),
          stroke: "3 black"
        }        
      }
    }

    let links = _fetchedData.map(_n => {
        return {
            from: _n.id_source,
            to: _n.id_target,
            value: precise(_n.correlation,4),
            normal: {
              stroke: {
                thickness: _n.correlation
              }
            },
            hovered: {
              stroke: {
                thickness: _n.correlation
              }
            },
            selected: {
              stroke: {
                thickness: _n.correlation,
                color: 'red'
              }
            }
        }
    })

    let values = links.map(_l => parseFloat(_l.value))
    let x = makeArr(_.min(values), _.max(values), 10)
    let dis = makeArr(0.1,3,15)
    
    for (let v=0; v<values.length; v++) {
      let flag = true
      for (let i=0; i<x.length; i++) {
        if(values[v]<=x[i] && flag) {
          flag = false
          links[v].normal.stroke.thickness = dis[i]
          links[v].hovered.stroke.thickness = dis[i]
          links[v].selected.stroke.thickness = dis[i]
        }
      }
    }



    return {nodes: nodes, edges: links}
}


export const filterNodes = (_friendsMetadata, _geneSetNumber) => {
    return _.filter(_friendsMetadata, _e => {
        return _e.geneSetNumber >= _geneSetNumber
    })
}


// reference: https://www.geeksforgeeks.org/how-to-count-number-of-occurrences-of-repeated-names-in-an-array-of-objects-in-javascript/
export const findOcc = (_arr, _key) => {
    let arr2 = [];
      
    _arr.forEach((x)=>{
         
      // Checking if there is any object in arr2
      // which contains the key value
       if(arr2.some((val)=>{ return val[_key] == x[_key] })){
           
         // If yes! then increase the occurrence by 1
         arr2.forEach((k)=>{
           if(k[_key] === x[_key]){ 
             k["field"]++
           }
        })
           
       } else{
         // If not! Then create a new object initialize 
         // it with the present iteration key's value and 
         // set the occurrence to 1
         let a = {}
         a[_key] = x[_key]
         a["field"] = 1
         arr2.push(a);
       }
    })
      
    return arr2
  }


export const graphSpecifications = () => {
    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 1000,
        "height": 550,
        "padding": 0,
        "autosize": "none",
      
        "signals": [
          { "name": "cx", "update": "width / 2" },
          { "name": "cy", "update": "height / 2" },
          { "name": "nodeRadius", "value": 15 },
          { "name": "nodeCharge", "value": -30 },
          { "name": "linkDistance", "value": 40 },
          { "name": "static", "value": false },
          {
            "description": "State variable for active node fix status.",
            "name": "fix", "value": false,
            "on": [
              {
                "events": "symbol:mouseout[!event.buttons], window:mouseup",
                "update": "false"
              },
              {
                "events": "symbol:mouseover",
                "update": "fix || true"
              },
              {
                "events": "[symbol:mousedown, window:mouseup] > window:mousemove!",
                "update": "xy()",
                "force": true
              }
            ]
          },
          {
            "description": "Graph node most recently interacted with.",
            "name": "node", "value": null,
            "on": [
              {
                "events": "symbol:mousedown",
                "update": "fix === true ? item().datum : node"
              }
            ]
          },
          {
            "description": "Flag to restart Force simulation upon data changes.",
            "name": "restart", "value": false,
            "on": [
              {"events": {"signal": "fix"}, "update": "fix && fix.length"}
            ]
          },
          {
            "name": "xoffset",
            "update": "-(height + padding.bottom)"
          },
          {
            "name": "yoffset",
            "update": "-(width + padding.left)"
          },
          { "name": "xrange", "update": "[0, width]" },
          { "name": "yrange", "update": "[height, 0]" },
      
          {
            "name": "down", "value": null,
            "on": [
              {"events": "touchend", "update": "null"},
              {"events": "mousedown, touchstart", "update": "xy()"}
            ]
          },
          {
            "name": "xcur", "value": null,
            "on": [
              {
                "events": "mousedown, touchstart, touchend",
                "update": "slice(xdom)"
              }
            ]
          },
          {
            "name": "ycur", "value": null,
            "on": [
              {
                "events": "mousedown, touchstart, touchend",
                "update": "slice(ydom)"
              }
            ]
          },
          {
            "name": "delta", "value": [0, 0],
            "on": [
              {
                "events": [
                  {
                    "source": "window", "type": "mousemove", "consume": true,
                    "between": [{"type": "mousedown"}, {"source": "window", "type": "mouseup"}]
                  },
                  {
                    "type": "touchmove", "consume": true,
                    "filter": "event.touches.length === 1"
                  }
                ],
                "update": "(down && !fix) ? [down[0]-x(), y()-down[1]] : [0,0]"
              }
            ]
          },
      
          {
            "name": "anchor", "value": [0, 0],
            "on": [
              {
                "events": "wheel",
                "update": "[invert('xscale', x()), invert('yscale', y())]"
              },
              {
                "events": {"type": "touchstart", "filter": "event.touches.length===2"},
                "update": "[(xdom[0] + xdom[1]) / 2, (ydom[0] + ydom[1]) / 2]"
              }
            ]
          },
          {
            "name": "zoom", "value": 1,
            "on": [
              {
                "events": "wheel!",
                "force": true,
                "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
              },
              {
                "events": {"signal": "dist2"},
                "force": true,
                "update": "dist1 / dist2"
              }
            ]
          },
          {
            "name": "dist1", "value": 0,
            "on": [
              {
                "events": {"type": "touchstart", "filter": "event.touches.length===2"},
                "update": "pinchDistance(event)"
              },
              {
                "events": {"signal": "dist2"},
                "update": "dist2"
              }
            ]
          },
          {
            "name": "dist2", "value": 0,
            "on": [{
              "events": {"type": "touchmove", "consume": true, "filter": "event.touches.length===2"},
              "update": "pinchDistance(event)"
            }]
          },
      
          {
            "name": "xdom", "update": "[0, width]",
            "on": [
              {
                "events": {"signal": "delta"},
                "update": "[xcur[0] + span(xcur) * delta[0] / width, xcur[1] + span(xcur) * delta[0] / width]"
              },
              {
                "events": {"signal": "zoom"},
                "update": "[anchor[0] + (xdom[0] - anchor[0]) * zoom, anchor[0] + (xdom[1] - anchor[0]) * zoom]"
              }
            ]
          },
          {
            "name": "ydom", "update": "[0, width]",
            "on": [
              {
                "events": {"signal": "delta"},
                "update": "[ycur[0] + span(ycur) * delta[1] / height, ycur[1] + span(ycur) * delta[1] / height]"
              },
              {
                "events": {"signal": "zoom"},
                "update": "[anchor[1] + (ydom[0] - anchor[1]) * zoom, anchor[1] + (ydom[1] - anchor[1]) * zoom]"
              }
            ]
          },
          {
            "name": "size",
            "update": "clamp(20 / span(xdom), 1, 1000)"
          }
        ],
      
        "data": [
        
          {
            "name": "link-data",
            "values": [],
            "format": {"type": "json"}
          },
          {
            "name": "node-data",
            "values": [],
            "format": {"type": "json"},
            "transform": [
              {
                "type": "force",
                "iterations": 300,
                "velocityDecay": {"signal": "1"},
                "restart": {"signal": "restart"},
                "static": {"signal": "static"},
                "signal": "force",
                "forces": [
                  {"force": "center", "x": {"signal": "cx"}, "y": {"signal": "cy"}},
                  {"force": "collide", "radius": {"signal": "nodeRadius"}},
                  {"force": "nbody", "strength": {"signal": "nodeCharge"}},
                  {"force": "link", "links": "link-data", "id": "id", "distance": {"signal": "linkDistance"}}
                ]
              }
            ],
            "on": [
              {
                "trigger": "fix",
                "modify": "node",
                "values": "fix === true ? {fx: null, fy: null} : {fx: invert('xscale', fix[0]), fy: invert('yscale', fix[1]) }"
              },
              {
                "trigger": "!fix",
                "modify": "node", "values": "{fx: null, fy: null}"
              }
            ]
          }
        ],
      
        "scales": [
          {
            "name": "color",
            "type": "ordinal",
            "domain": {"data": "node-data", "field": "group"},
            "range": {"scheme": "category20c"}
          },
        
          {
            "name": "xscale", "zero": false,
            "domain": {"signal": "xdom"},
            "range": {"signal": "xrange"}
          },
          {
            "name": "yscale", "zero": false,
            "domain": {"signal": "ydom"},
            "range": {"signal": "yrange"}
          }
        ],
      
        "marks": [
          {
            "name": "nodes",
            "type": "symbol",
            "zindex": 1,
            "clip": true,
            "from": {"data": "node-data"},
            "on": [
              {
                "trigger": "fix",
                "modify": "node",
                "values": "(fix && fix.length) ? {fx: fix[0], fy: fix[1]} : {}"
              },
              {
                "trigger": "!fix",
                "modify": "node", "values": "{fx: null, fy: null}"
              }
            ],
      
            "encode": {
              "enter": {
                "fill": {"scale": "color", "field": "group"}
              },
              "update": {
                "size": {"signal": "2 * nodeRadius * nodeRadius"},
                "cursor": {"value": "pointer"},
                "stroke": [
                  {
                    "test": "node?node.index==datum.index: false",
                    "value": "black"
                  },
                  {"value": "gray"}
                ],
                "strokeWidth": [
                  {
                    "test": "node?node.index==datum.index: false",
                    "value": 3
                  },
                  {"value": 0.5}
                ],
                "x": {"scale": "xscale", "field": "x"},
                "y": {"scale": "yscale", "field": "y"}
              }
            }
          },
          {
            "name": "links",
            "type": "path",
            "from": {"data": "link-data"},
            "interactive": false,
            "encode": {
              "update": {
                "stroke": {"value": "#ccc"},
                "strokeWidth": {"field": "value"}
              }
            },
            "transform": [
              {
                "type": "formula", "as": "srcx", "expr": "scale('xscale', datum.datum.source.x)"
              },
              {
                "type": "formula", "as": "srcy", "expr": "scale('yscale', datum.datum.source.y)"
              },
              {
                "type": "formula", "as": "trgx", "expr": "scale('xscale', datum.datum.target.x)"
              },
              {
                "type": "formula", "as": "trgy", "expr": "scale('yscale', datum.datum.target.y)"
              },
              {
                "type": "linkpath",
                "require": {"signal": "force"},
                "shape": "line",
                "sourceX": "srcx", "sourceY": "srcy",
                "targetX": "trgx", "targetY": "trgy"
              }
            ]
          }
        ]
      }
}


export const pieChartSpecifications1 = (_attribute, _frequencies, _title) => {
  return {
    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
    "width": 200,
    "height": 200,
    "autosize": "pad",
    "signals": [
      {"name": "startAngle", "value": 0},
      {"name": "endAngle", "value": 6.29},
      {"name": "padAngle", "value": 0},
      {"name": "sort", "value": true},
      {"name": "strokeWidth", "value": 2},
      {
        "name": "selected",
        "value": "",
        "on": [{"events": "mouseover", "update": "datum"}]
      }
    ],
    "data": [
      {
        "name": "table",
        "values": _frequencies,
        "transform": [
          {
            "type": "pie",
            "field": "population",
            "startAngle": {"signal": "startAngle"},
            "endAngle": {"signal": "endAngle"},
            "sort": {"signal": "sort"}
          }
        ]
      },
      {
        "name": "fieldSum",
        "source": "table",
        "transform": [
          {
            "type": "aggregate",
            "fields": ["population"],
            "ops": ["sum"],
            "as": ["sum"]
          }
        ]
      }
    ],
    "legends": [
      {
        "fill": "color",
        "title": "Legend",
        "orient": "none",
        "padding": {"value": 10},
        "encode": {
          "symbols": {"enter": {"fillOpacity": {"value": 1}}},
          "legend": {
            "update": {
              "x": {
                "signal": "(width / 2) + if(selected && selected.continent == datum.continent, if(width >= height, height, width) / 2 * 1.1 * 0.8, if(width >= height, height, width) / 2 * 0.8)",
                "offset": 20
              },
              "y": {"signal": "(height / 2)", "offset": -50}
            }
          }
        }
      }
    ],
    "scales": [
      {
        "name": "color",
        "type": "ordinal",
        "domain": {"data": "table", "field": _attribute},
        "range": {"scheme": "category20"}
      }
    ],
    "marks": [
      {
        "type": "arc",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "fill": {"scale": "color", "field": "continent"},
            "x": {"signal": "width / 2"},
            "y": {"signal": "height / 2"}
          },
          "update": {
            "startAngle": {"field": "startAngle"},
            "endAngle": {"field": "endAngle"},
            "padAngle": {
              "signal": "if(selected && selected.continent == datum.continent, 0.015, 0.015)"
            },
            "innerRadius": {
              "signal": "if(selected && selected.continent == datum.continent, if(width >= height, height, width) / 2 * 0.45, if(width >= height, height, width) / 2 * 0.5)"
            },
            "outerRadius": {
              "signal": "if(selected && selected.continent == datum.continent, if(width >= height, height, width) / 2 * 1.05 * 0.8, if(width >= height, height, width) / 2 * 0.8)"
            },
            "opacity": {
              "signal": "if(selected && selected.continent !== datum.continent, 1, 1)"
            },
            "stroke": {"signal": "scale('color', datum.continent)"},
            "strokeWidth": {"signal": "strokeWidth"},
            "fillOpacity": {
              "signal": "if(selected && selected.continent == datum.continent, 0.8, 0.8)"
            }
          }
        }
      },
      {
        "type": "text",
        "encode": {
          "enter": {"fill": {"value": "#525252"}, "text": {"value": ""}},
          "update": {
            "opacity": {"value": 1},
            "x": {"signal": "width / 2"},
            "y": {"signal": "height / 2"},
            "align": {"value": "center"},
            "baseline": {"value": "middle"},
            "fontSize": {"signal": "if(width >= height, height, width) * 0.05"},
            "text": {"value": _title}
          }
        }
      },
      {
        "name": "mark_population",
        "type": "text",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "text": {
              "signal": "if(datum['endAngle'] - datum['startAngle'] < 0.3, '', format(datum['population'] / 1e9, '.2f'))"
            },
            "x": {"signal": "if(width >= height, height, width) / 2"},
            "y": {"signal": "if(width >= height, height, width) / 2"},
            "radius": {
              "signal": "if(selected && selected.continent == datum.continent, if(width >= height, height, width) / 2 * 1.05 * 0.65, if(width >= height, height, width) / 2 * 0.65)"
            },
            "theta": {"signal": "(datum['startAngle'] + datum['endAngle'])/2"},
            "fill": {"value": "#FFFFFF"},
            "fontSize": {"value": 12},
            "align": {"value": "center"},
            "baseline": {"value": "middle"}
          }
        }
      }
    ]
  }
}

export const pieChartSpecifications = (_attribute, _frequencies, _title) => {
    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "A basic pie chart example.",
        "width": 200,
        "height": 200,
        "autosize": "pad",
      
        "signals": [
          {
            "name": "startAngle", "value": 0
          },
          {
            "name": "endAngle", "value": 6.29
          },
          {
            "name": "padAngle", "value": 0.024
          },
          {
            "name": "innerRadius", "value": 47
          },
          {
            "name": "cornerRadius", "value": 3.5
          },
          {
            "name": "sort", "value": true
          }
        ],
      
        "data": [
          {
            "name": "table",
            "values": _frequencies,
            "transform": [
              {
                "type": "pie",
                "field": "field",
                "startAngle": {"signal": "startAngle"},
                "endAngle": {"signal": "endAngle"},
                "sort": {"signal": "sort"}
              }
            ]
          }
        ],
      
        "scales": [
          {
            "name": "color",
            "type": "ordinal",
            "domain": {"data": "table", "field": _attribute},
            "range": {"scheme": "category20"}
          }
        ],
        
        "legends": [
            { 
              "orient": "right",
              "fill": "color",
              "offset": 35,
              "encode": {
                "symbols": {"enter": {"fillOpacity": {"value": 1}}},
                "labels": {
                  "interactive": true,
                  "update": {
                    "fontSize": {"value": 15},
                    "fill": {"value": "black"}
                  },
                  "hover": {
                    "fill": {"value": "firebrick"}
                  }
                }
              }
            }
        ],

        "marks": [
          {
            "type": "arc",
            "from": {"data": "table"},
            "encode": {
              "enter": {
                "fill": {"scale": "color", "field": _attribute},
                "x": {"signal": "width / 2"},
                "y": {"signal": "height / 2"}
              },
              "update": {
                "startAngle": {"field": "startAngle"},
                "endAngle": {"field": "endAngle"},
                "padAngle": {"signal": "padAngle"},
                "innerRadius": {"signal": "innerRadius"},
                "outerRadius": {"signal": "width / 2"},
                "cornerRadius": {"signal": "cornerRadius"}
              }
            }
          }
        ]
      }
}

export const wordcloudSpecifications = (_annotations) => {
    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "A word cloud visualization depicting Vega research paper abstracts.",
        "width": 100,
        "height": 100,
        "padding": 0,

        "data": [{
            "name": "table",
            "values": [
                _annotations
            ],
            "transform": [{
                    "type": "countpattern",
                    "field": "data",
                    "case": "upper",
                    "pattern": "[\\w']{3,}",
                    "stopwords": "(Symbol|Acc|Source|RGD|LIKE__|_MEMBER_|LIKE_|BODY|TYPE|MGI|PROCESS|SUB|OPPOSITE|ENCODED|PREDICTED|INTERACTING|COMPONENT|SPECIFIC|INTERACTING|ACC|DNA|PART|CHANGE|REGION|error|dna|activity|involved|link|non|associated|HGNC|molecule|family|dependent|tissue|subfamily|member|like|subunit|related|factor|containing|source|domain|symbol|i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)"
                },
                {
                    "type": "formula",
                    "as": "angle",
                    "expr": "[-45, 0, 45][~~(random() * 3)]"
                },
                {
                    "type": "formula",
                    "as": "weight",
                    "expr": "if(datum.text=='VEGA', 600, 300)"
                }
            ]
        }],

        "scales": [{
            "name": "color",
            "type": "ordinal",
            "domain": {
                "data": "table",
                "field": "text"
            },
            "range": ["#d5a928", "#652c90", "#939597"]
        }],
        "marks": [{
            "type": "text",
            "from": {
                "data": "table"
            },
            "encode": {
                "enter": {
                    "text": {
                        "field": "text"
                    },
                    "align": {
                        "value": "center"
                    },
                    "baseline": {
                        "value": "alphabetic"
                    },
                    "fill": {
                        "scale": "color",
                        "field": "text"
                    }
                },
                "update": {
                    "fillOpacity": {
                        "value": 1
                    }
                },
                "hover": {
                    "fillOpacity": {
                        "value": 0.5
                    }
                }
            },
            "transform": [{
                "type": "wordcloud",
                "size": [450, 400],
                "text": {
                    "field": "text"
                },
                "rotate": {
                    "field": "datum.angle"
                },
                "font": "Helvetica Neue, Arial",
                "fontSize": {
                    "field": "datum.count"
                },
                "fontWeight": {
                    "field": "datum.weight"
                },
                "fontSizeRange": [12, 56],
                "padding": 2
            }]
        }]
    }
}