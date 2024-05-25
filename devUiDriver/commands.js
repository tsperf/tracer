export const commands = [
  {
    trigger: {
      command: 'tsperf.tracer.runTrace',
      args: [],
    },
    response: {
      message: 'traceStart',
    },
  },
  {
    trigger: {
      command: 'tsperf.tracer.runTrace',
      args: [],
    },
    response: {
      message: 'traceStop',
    },
  },
  {
    trigger: {
      command: 'tsperf.tracer.runTrace',
      args: [],
    },
    response: {
      message: 'traceFileLoaded',
      fileName: 'types.json',
      dirName: '/home/hw/.vscode-server/data/User/globalStorage/tsperf.tracer/TODO/default/traces',
    },
  },
  {
    trigger: {
      command: 'tsperf.tracer.runTrace',
      args: [],
    },
    response: {
      message: 'showTree',
      nodes: [],
    },
  },
  {
    trigger: {
      command: 'tsperf.tracer.runTrace',
      args: [],
    },
    response: {
      message: 'traceFileLoaded',
      fileName: 'trace.json',
      dirName: '/home/hw/.vscode-server/data/User/globalStorage/tsperf.tracer/TODO/default/traces',
    },
  },
  {
    trigger: {
      command: 'tsperf.tracer.runTrace',
      args: [],
    },
    response: {
      message: 'showTree',
      nodes: [
        {
          id: 108,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 3679582.8469991684,
            name: 'checkVariableDeclaration',
            dur: 4510.601997375488,
            args: {
              kind: 260,
              pos: 1067,
              end: 1131,
              path: '/home/hw/projects/tracer/playground/index.ts',
            },
          },
          children: [
            {
              id: 109,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3679702.647000551,
                name: 'checkExpression',
                dur: 929.8999905586243,
                args: {
                  kind: 80,
                  pos: 1083,
                  end: 1091,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                  results: {
                    typeId: 302,
                  },
                },
              },
              children: [],
              types: [
                {
                  id: 304,
                  recursionId: 238,
                  flags: [
                    'Union',
                  ],
                  ts: 3680349.247008562,
                },
              ],
              childTypeCnt: 0,
            },
          ],
          types: [
            {
              id: 305,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3680904.7470092773,
            },
            {
              id: 306,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3680906.6469967365,
            },
            {
              id: 307,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3680911.047011614,
            },
            {
              id: 308,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3680914.247006178,
            },
            {
              id: 309,
              recursionId: 239,
              flags: [
                'Object',
              ],
              ts: 3681832.047998905,
              display: '{ Output: number; }',
            },
            {
              id: 310,
              recursionId: 240,
              flags: [
                'Object',
              ],
              ts: 3681892.248004675,
            },
            {
              id: 311,
              recursionId: 241,
              flags: [
                'Object',
              ],
              ts: 3681942.84799695,
              display: '{ Error: Error; }',
            },
            {
              id: 312,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3682810.0480139256,
            },
            {
              id: 313,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3682812.5480115414,
            },
            {
              id: 314,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3682852.347999811,
            },
            {
              id: 315,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3682853.8480103016,
            },
            {
              id: 316,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3682881.1480104923,
            },
            {
              id: 317,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3682882.2480142117,
            },
            {
              id: 318,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3682900.9480178356,
            },
            {
              id: 319,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3682901.847988367,
            },
            {
              id: 320,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3683930.748999119,
            },
            {
              id: 321,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3683949.1490125656,
            },
          ],
          childTypeCnt: 1,
        },
        {
          id: 110,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 3689489.0519976616,
            name: 'checkVariableDeclaration',
            dur: 1167.1999990940094,
            args: {
              kind: 260,
              pos: 1427,
              end: 1479,
              path: '/home/hw/projects/tracer/playground/index.ts',
            },
          },
          children: [
            {
              id: 111,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3689677.8520047665,
                name: 'checkExpression',
                dur: 870.7999885082245,
                args: {
                  kind: 213,
                  pos: 1443,
                  end: 1479,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                  results: {
                    typeId: 417,
                  },
                },
              },
              children: [],
              types: [
                {
                  id: 407,
                  recursionId: 253,
                  flags: [
                    'Object',
                  ],
                  ts: 3689773.452013731,
                  display: '{ Output: number; }',
                },
                {
                  id: 408,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3689830.0519883633,
                },
                {
                  id: 409,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3689831.2520086765,
                },
                {
                  id: 410,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3690382.7520012856,
                },
                {
                  id: 411,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3690384.4520151615,
                },
                {
                  id: 412,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3690402.2519886494,
                },
                {
                  id: 413,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3690403.151988983,
                },
                {
                  id: 414,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3690415.751993656,
                },
                {
                  id: 415,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3690416.5520071983,
                },
                {
                  id: 416,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3690531.7519903183,
                },
                {
                  id: 417,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3690545.1520085335,
                },
              ],
              childTypeCnt: 0,
            },
          ],
          types: [
            {
              id: 402,
              recursionId: 252,
              flags: [
                'Union',
              ],
              ts: 3689593.1520164013,
            },
            {
              id: 403,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689664.7520065308,
            },
            {
              id: 404,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689665.85201025,
            },
            {
              id: 405,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689666.4519906044,
            },
            {
              id: 406,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689666.9520139694,
            },
          ],
          childTypeCnt: 11,
        },
        {
          id: 112,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 3699827.1569907665,
            name: 'checkVariableDeclaration',
            dur: 25543.21300983429,
            args: {
              kind: 260,
              pos: 1660,
              end: 1714,
              path: '/home/hw/projects/tracer/playground/index.ts',
            },
          },
          children: [
            {
              id: 113,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3700001.157015562,
                name: 'checkExpression',
                dur: 25221.71199321747,
                args: {
                  kind: 213,
                  pos: 1677,
                  end: 1714,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                  results: {
                    typeId: 481,
                  },
                },
              },
              children: [],
              types: [
                {
                  id: 471,
                  recursionId: 261,
                  flags: [
                    'Object',
                  ],
                  ts: 3700250.1569986343,
                  display: '{ Output: number; }',
                },
                {
                  id: 472,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3700308.1569969654,
                },
                {
                  id: 473,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3700309.657007456,
                },
                {
                  id: 474,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3724842.5689935684,
                },
                {
                  id: 475,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3724846.469014883,
                },
                {
                  id: 476,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3724867.2690093517,
                },
                {
                  id: 477,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3724868.268996477,
                },
                {
                  id: 478,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3724877.669006586,
                },
                {
                  id: 479,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3724878.468990326,
                },
                {
                  id: 480,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3725209.4689905643,
                },
                {
                  id: 481,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3725217.768996954,
                },
              ],
              childTypeCnt: 0,
            },
          ],
          types: [
            {
              id: 466,
              recursionId: 260,
              flags: [
                'Union',
              ],
              ts: 3699950.1570165157,
            },
            {
              id: 467,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699989.1569912434,
            },
            {
              id: 468,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699989.9570047855,
            },
            {
              id: 469,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699990.4569983482,
            },
            {
              id: 470,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699990.8570051193,
            },
          ],
          childTypeCnt: 11,
        },
        {
          id: 114,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 3726304.470002651,
            name: 'checkVariableDeclaration',
            dur: 8498.603999614716,
            args: {
              kind: 260,
              pos: 1741,
              end: 1795,
              path: '/home/hw/projects/tracer/playground/index.ts',
            },
          },
          children: [
            {
              id: 115,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3726711.670011282,
                name: 'checkExpression',
                dur: 7923.803985118866,
                args: {
                  kind: 213,
                  pos: 1758,
                  end: 1795,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                  results: {
                    typeId: 496,
                  },
                },
              },
              children: [],
              types: [
                {
                  id: 486,
                  recursionId: 262,
                  flags: [
                    'Object',
                  ],
                  ts: 3726799.270004034,
                  display: '{ Output: number; }',
                },
                {
                  id: 487,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3726878.769993782,
                },
                {
                  id: 488,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3726880.070000887,
                },
                {
                  id: 489,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3734419.8740124702,
                },
                {
                  id: 490,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3734424.2739975452,
                },
                {
                  id: 491,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3734443.874001503,
                },
                {
                  id: 492,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3734444.674015045,
                },
                {
                  id: 493,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3734453.3739984035,
                },
                {
                  id: 494,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3734454.1740119457,
                },
                {
                  id: 495,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3734624.574005604,
                },
                {
                  id: 496,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3734630.8740079403,
                },
              ],
              childTypeCnt: 0,
            },
          ],
          types: [
            {
              id: 482,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3726696.469992399,
            },
            {
              id: 483,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3726697.870016098,
            },
            {
              id: 484,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3726698.4699964523,
            },
            {
              id: 485,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3726698.969990015,
            },
          ],
          childTypeCnt: 11,
        },
      ],
    },
  },
  {
    trigger: {
      startsWith: '',
      sourceFileName: '',
      position: 0,
      message: 'filterTree',
    },
    response: {
      message: 'showTree',
      nodes: [
        {
          id: 0,
          line: {
            cat: 'root',
            name: 'root',
            ph: 'root',
            pid: 1,
            tid: 1,
            ts: 0,
            dur: 1032702.3969888687,
          },
          children: [
            {
              id: 1,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'program',
                ts: 617644.3980038166,
                name: 'processRootFiles',
                dur: 62610.100001096725,
                args: {},
              },
              children: [
                {
                  id: 2,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 618088.7980163097,
                    name: 'findSourceFile',
                    dur: 49644.999980926514,
                    args: {},
                  },
                  children: [],
                  types: [],
                  childTypeCnt: 0,
                },
              ],
              types: [],
              childTypeCnt: 0,
            },
            {
              id: 3,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'program',
                ts: 843519.5980072021,
                name: 'processTypeReferences',
                dur: 2338874.2019832134,
                args: {},
              },
              children: [
                {
                  id: 4,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 843998.1980025768,
                    name: 'resolveTypeReferenceDirectiveNamesWorker',
                    dur: 188440.59899449348,
                    args: {},
                  },
                  children: [],
                  types: [],
                  childTypeCnt: 0,
                },
                {
                  id: 5,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 1032702.3969888687,
                    name: 'processTypeReferenceDirective',
                    dur: 947736.0060214996,
                    args: {},
                  },
                  children: [
                    {
                      id: 6,
                      line: {
                        pid: 1,
                        tid: 1,
                        ph: 'X',
                        cat: 'program',
                        ts: 1032882.7970027924,
                        name: 'findSourceFile',
                        dur: 947519.0060138702,
                        args: {},
                      },
                      children: [
                        {
                          id: 7,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1049934.3970119953,
                            name: 'resolveModuleNamesWorker',
                            dur: 277905.88200092316,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 8,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1328173.3790040016,
                            name: 'findSourceFile',
                            dur: 220089.8090004921,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 9,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1548336.9880020618,
                            name: 'findSourceFile',
                            dur: 63400.33200383186,
                            args: {},
                          },
                          children: [
                            {
                              id: 10,
                              line: {
                                pid: 1,
                                tid: 1,
                                ph: 'X',
                                cat: 'program',
                                ts: 1562989.0950024128,
                                name: 'findSourceFile',
                                dur: 48701.824992895126,
                                args: {},
                              },
                              children: [],
                              types: [],
                              childTypeCnt: 0,
                            },
                          ],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 11,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1611826.920002699,
                            name: 'findSourceFile',
                            dur: 15073.606997728348,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 12,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1626997.8269934654,
                            name: 'findSourceFile',
                            dur: 20245.810002088547,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 13,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1647339.6370112896,
                            name: 'findSourceFile',
                            dur: 9708.40498805046,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 14,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1657129.9419999123,
                            name: 'findSourceFile',
                            dur: 16922.80900478363,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 15,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1674143.1510150433,
                            name: 'findSourceFile',
                            dur: 33630.51599264145,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 16,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1708695.3679919243,
                            name: 'findSourceFile',
                            dur: 4882.602006196976,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 17,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1713668.7700152397,
                            name: 'findSourceFile',
                            dur: 65707.33299851418,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 18,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1779446.603000164,
                            name: 'findSourceFile',
                            dur: 20437.810003757477,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 19,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1809908.1180095673,
                            name: 'findSourceFile',
                            dur: 43605.72198033333,
                            args: {},
                          },
                          children: [
                            {
                              id: 20,
                              line: {
                                pid: 1,
                                tid: 1,
                                ph: 'X',
                                cat: 'program',
                                ts: 1847640.4370069504,
                                name: 'findSourceFile',
                                dur: 5770.702987909317,
                                args: {},
                              },
                              children: [],
                              types: [],
                              childTypeCnt: 0,
                            },
                          ],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 21,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1853570.8400011063,
                            name: 'findSourceFile',
                            dur: 8602.903991937637,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 22,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1869593.6480164528,
                            name: 'findSourceFile',
                            dur: 1180.999994277954,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 23,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1875676.6510009766,
                            name: 'findSourceFile',
                            dur: 38427.81901359558,
                            args: {},
                          },
                          children: [
                            {
                              id: 24,
                              line: {
                                pid: 1,
                                tid: 1,
                                ph: 'X',
                                cat: 'program',
                                ts: 1894580.7600021362,
                                name: 'findSourceFile',
                                dur: 19478.410005569458,
                                args: {},
                              },
                              children: [],
                              types: [],
                              childTypeCnt: 0,
                            },
                          ],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 25,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1914148.5700011253,
                            name: 'findSourceFile',
                            dur: 8469.904005527496,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 26,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1922846.6739952564,
                            name: 'findSourceFile',
                            dur: 28395.7140147686,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 27,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 1959160.6920063496,
                            name: 'findSourceFile',
                            dur: 21202.311009168625,
                            args: {},
                          },
                          children: [
                            {
                              id: 28,
                              line: {
                                pid: 1,
                                tid: 1,
                                ph: 'X',
                                cat: 'program',
                                ts: 1979932.3030114174,
                                name: 'resolveModuleNamesWorker',
                                dur: 297.1999943256378,
                                args: {},
                              },
                              children: [],
                              types: [],
                              childTypeCnt: 0,
                            },
                          ],
                          types: [],
                          childTypeCnt: 0,
                        },
                      ],
                      types: [],
                      childTypeCnt: 0,
                    },
                  ],
                  types: [],
                  childTypeCnt: 0,
                },
                {
                  id: 29,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 1985702.7049958706,
                    name: 'processTypeReferenceDirective',
                    dur: 74684.83799695969,
                    args: {},
                  },
                  children: [
                    {
                      id: 30,
                      line: {
                        pid: 1,
                        tid: 1,
                        ph: 'X',
                        cat: 'program',
                        ts: 1985708.9050114155,
                        name: 'findSourceFile',
                        dur: 74640.43697714806,
                        args: {},
                      },
                      children: [
                        {
                          id: 31,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 2025667.425006628,
                            name: 'findSourceFile',
                            dur: 9765.10500907898,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 32,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 2035502.229988575,
                            name: 'findSourceFile',
                            dur: 24409.71201658249,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                      ],
                      types: [],
                      childTypeCnt: 0,
                    },
                  ],
                  types: [],
                  childTypeCnt: 0,
                },
                {
                  id: 33,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 2060555.8429956436,
                    name: 'processTypeReferenceDirective',
                    dur: 959007.3760151863,
                    args: {},
                  },
                  children: [
                    {
                      id: 34,
                      line: {
                        pid: 1,
                        tid: 1,
                        ph: 'X',
                        cat: 'program',
                        ts: 2060562.7430081367,
                        name: 'findSourceFile',
                        dur: 958931.9759905338,
                        args: {},
                      },
                      children: [
                        {
                          id: 35,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 2075001.549988985,
                            name: 'processTypeReferenceDirective',
                            dur: 943375.2680122852,
                            args: {},
                          },
                          children: [
                            {
                              id: 36,
                              line: {
                                pid: 1,
                                tid: 1,
                                ph: 'X',
                                cat: 'program',
                                ts: 2075016.0500109196,
                                name: 'findSourceFile',
                                dur: 943309.2679977417,
                                args: {},
                              },
                              children: [
                                {
                                  id: 37,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2075684.7499907017,
                                    name: 'findSourceFile',
                                    dur: 11361.405998468399,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 38,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2087910.356014967,
                                    name: 'findSourceFile',
                                    dur: 200228.39999198914,
                                    args: {},
                                  },
                                  children: [
                                    {
                                      id: 39,
                                      line: {
                                        pid: 1,
                                        tid: 1,
                                        ph: 'X',
                                        cat: 'program',
                                        ts: 2116918.570995331,
                                        name: 'findSourceFile',
                                        dur: 171009.88501310349,
                                        args: {},
                                      },
                                      children: [
                                        {
                                          id: 40,
                                          line: {
                                            pid: 1,
                                            tid: 1,
                                            ph: 'X',
                                            cat: 'program',
                                            ts: 2119139.8720145226,
                                            name: 'resolveModuleNamesWorker',
                                            dur: 31506.915003061295,
                                            args: {},
                                          },
                                          children: [],
                                          types: [],
                                          childTypeCnt: 0,
                                        },
                                        {
                                          id: 41,
                                          line: {
                                            pid: 1,
                                            tid: 1,
                                            ph: 'X',
                                            cat: 'program',
                                            ts: 2150752.086997032,
                                            name: 'findSourceFile',
                                            dur: 113378.75699996948,
                                            args: {},
                                          },
                                          children: [
                                            {
                                              id: 42,
                                              line: {
                                                pid: 1,
                                                tid: 1,
                                                ph: 'X',
                                                cat: 'program',
                                                ts: 2167977.8960049152,
                                                name: 'resolveModuleNamesWorker',
                                                dur: 8228.60398888588,
                                                args: {},
                                              },
                                              children: [],
                                              types: [],
                                              childTypeCnt: 0,
                                            },
                                            {
                                              id: 43,
                                              line: {
                                                pid: 1,
                                                tid: 1,
                                                ph: 'X',
                                                cat: 'program',
                                                ts: 2178798.301011324,
                                                name: 'findSourceFile',
                                                dur: 1827.1009922027588,
                                                args: {},
                                              },
                                              children: [],
                                              types: [],
                                              childTypeCnt: 0,
                                            },
                                            {
                                              id: 44,
                                              line: {
                                                pid: 1,
                                                tid: 1,
                                                ph: 'X',
                                                cat: 'program',
                                                ts: 2193966.509014368,
                                                name: 'findSourceFile',
                                                dur: 6752.402991056442,
                                                args: {},
                                              },
                                              children: [],
                                              types: [],
                                              childTypeCnt: 0,
                                            },
                                            {
                                              id: 45,
                                              line: {
                                                pid: 1,
                                                tid: 1,
                                                ph: 'X',
                                                cat: 'program',
                                                ts: 2200783.9120030403,
                                                name: 'findSourceFile',
                                                dur: 33387.81699538231,
                                                args: {},
                                              },
                                              children: [
                                                {
                                                  id: 46,
                                                  line: {
                                                    pid: 1,
                                                    tid: 1,
                                                    ph: 'X',
                                                    cat: 'program',
                                                    ts: 2202806.8130016327,
                                                    name: 'findSourceFile',
                                                    dur: 31324.916005134583,
                                                    args: {},
                                                  },
                                                  children: [
                                                    {
                                                      id: 47,
                                                      line: {
                                                        pid: 1,
                                                        tid: 1,
                                                        ph: 'X',
                                                        cat: 'program',
                                                        ts: 2225810.5250000954,
                                                        name: 'resolveModuleNamesWorker',
                                                        dur: 8125.203996896744,
                                                        args: {},
                                                      },
                                                      children: [],
                                                      types: [],
                                                      childTypeCnt: 0,
                                                    },
                                                  ],
                                                  types: [],
                                                  childTypeCnt: 0,
                                                },
                                              ],
                                              types: [],
                                              childTypeCnt: 0,
                                            },
                                            {
                                              id: 48,
                                              line: {
                                                pid: 1,
                                                tid: 1,
                                                ph: 'X',
                                                cat: 'program',
                                                ts: 2234208.629012108,
                                                name: 'findSourceFile',
                                                dur: 29895.81498503685,
                                                args: {},
                                              },
                                              children: [
                                                {
                                                  id: 49,
                                                  line: {
                                                    pid: 1,
                                                    tid: 1,
                                                    ph: 'X',
                                                    cat: 'program',
                                                    ts: 2237835.330992937,
                                                    name: 'findSourceFile',
                                                    dur: 26214.213013648987,
                                                    args: {},
                                                  },
                                                  children: [],
                                                  types: [],
                                                  childTypeCnt: 0,
                                                },
                                              ],
                                              types: [],
                                              childTypeCnt: 0,
                                            },
                                          ],
                                          types: [],
                                          childTypeCnt: 0,
                                        },
                                        {
                                          id: 50,
                                          line: {
                                            pid: 1,
                                            tid: 1,
                                            ph: 'X',
                                            cat: 'program',
                                            ts: 2268417.546004057,
                                            name: 'findSourceFile',
                                            dur: 4232.701987028122,
                                            args: {},
                                          },
                                          children: [
                                            {
                                              id: 51,
                                              line: {
                                                pid: 1,
                                                tid: 1,
                                                ph: 'X',
                                                cat: 'program',
                                                ts: 2269262.2460126877,
                                                name: 'findSourceFile',
                                                dur: 3326.5019953250885,
                                                args: {},
                                              },
                                              children: [],
                                              types: [],
                                              childTypeCnt: 0,
                                            },
                                          ],
                                          types: [],
                                          childTypeCnt: 0,
                                        },
                                        {
                                          id: 52,
                                          line: {
                                            pid: 1,
                                            tid: 1,
                                            ph: 'X',
                                            cat: 'program',
                                            ts: 2275784.649014473,
                                            name: 'findSourceFile',
                                            dur: 6966.203987598419,
                                            args: {},
                                          },
                                          children: [
                                            {
                                              id: 53,
                                              line: {
                                                pid: 1,
                                                tid: 1,
                                                ph: 'X',
                                                cat: 'program',
                                                ts: 2276764.149993658,
                                                name: 'findSourceFile',
                                                dur: 5939.703017473221,
                                                args: {},
                                              },
                                              children: [],
                                              types: [],
                                              childTypeCnt: 0,
                                            },
                                          ],
                                          types: [],
                                          childTypeCnt: 0,
                                        },
                                      ],
                                      types: [],
                                      childTypeCnt: 0,
                                    },
                                  ],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 54,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2289402.956008911,
                                    name: 'findSourceFile',
                                    dur: 23424.212008714676,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 55,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2312904.467999935,
                                    name: 'findSourceFile',
                                    dur: 34678.71701717377,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 56,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2347694.8850154877,
                                    name: 'findSourceFile',
                                    dur: 5502.80299782753,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 57,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2357414.790004492,
                                    name: 'findSourceFile',
                                    dur: 52944.426000118256,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 58,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2415125.5190074444,
                                    name: 'findSourceFile',
                                    dur: 5795.803010463715,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 59,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2429150.5260169506,
                                    name: 'findSourceFile',
                                    dur: 30045.914977788925,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 60,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2459269.841015339,
                                    name: 'findSourceFile',
                                    dur: 16018.307983875275,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 61,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2475396.3490128517,
                                    name: 'findSourceFile',
                                    dur: 38072.41898775101,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 62,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2513572.668015957,
                                    name: 'findSourceFile',
                                    dur: 70827.23498344421,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 63,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2584481.0030162334,
                                    name: 'findSourceFile',
                                    dur: 15372.30697274208,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 64,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2599932.209998369,
                                    name: 'findSourceFile',
                                    dur: 29438.414990901947,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 65,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2629504.624992609,
                                    name: 'findSourceFile',
                                    dur: 1600.3009974956512,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 66,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2636334.829002619,
                                    name: 'findSourceFile',
                                    dur: 62422.430992126465,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 67,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2699831.5600156784,
                                    name: 'findSourceFile',
                                    dur: 1530.800998210907,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 68,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2705710.162997246,
                                    name: 'findSourceFile',
                                    dur: 28089.714020490646,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 69,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2733874.377012253,
                                    name: 'findSourceFile',
                                    dur: 17763.309001922607,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 70,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2752689.8860037327,
                                    name: 'findSourceFile',
                                    dur: 27657.213985919952,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 71,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2781431.300997734,
                                    name: 'findSourceFile',
                                    dur: 39604.71901297569,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 72,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2827403.6230146885,
                                    name: 'findSourceFile',
                                    dur: 6868.30398440361,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 73,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2837415.527999401,
                                    name: 'findSourceFile',
                                    dur: 23761.11200451851,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 74,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2866139.443010092,
                                    name: 'findSourceFile',
                                    dur: 11514.10499215126,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 75,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2877725.448012352,
                                    name: 'findSourceFile',
                                    dur: 2281.1020016670227,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 76,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2889592.8539931774,
                                    name: 'findSourceFile',
                                    dur: 11465.906023979187,
                                    args: {},
                                  },
                                  children: [],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                                {
                                  id: 77,
                                  line: {
                                    pid: 1,
                                    tid: 1,
                                    ph: 'X',
                                    cat: 'program',
                                    ts: 2902544.560998678,
                                    name: 'findSourceFile',
                                    dur: 114881.35701417923,
                                    args: {},
                                  },
                                  children: [
                                    {
                                      id: 78,
                                      line: {
                                        pid: 1,
                                        tid: 1,
                                        ph: 'X',
                                        cat: 'program',
                                        ts: 2904493.862003088,
                                        name: 'findSourceFile',
                                        dur: 96075.04698634148,
                                        args: {},
                                      },
                                      children: [
                                        {
                                          id: 79,
                                          line: {
                                            pid: 1,
                                            tid: 1,
                                            ph: 'X',
                                            cat: 'program',
                                            ts: 2905360.6620132923,
                                            name: 'findSourceFile',
                                            dur: 82290.64098000526,
                                            args: {},
                                          },
                                          children: [
                                            {
                                              id: 80,
                                              line: {
                                                pid: 1,
                                                tid: 1,
                                                ph: 'X',
                                                cat: 'program',
                                                ts: 2906141.562998295,
                                                name: 'findSourceFile',
                                                dur: 77278.8380086422,
                                                args: {},
                                              },
                                              children: [
                                                {
                                                  id: 81,
                                                  line: {
                                                    pid: 1,
                                                    tid: 1,
                                                    ph: 'X',
                                                    cat: 'program',
                                                    ts: 2906791.3630008698,
                                                    name: 'findSourceFile',
                                                    dur: 71966.23599529266,
                                                    args: {},
                                                  },
                                                  children: [
                                                    {
                                                      id: 82,
                                                      line: {
                                                        pid: 1,
                                                        tid: 1,
                                                        ph: 'X',
                                                        cat: 'program',
                                                        ts: 2907359.2630028725,
                                                        name: 'findSourceFile',
                                                        dur: 69608.73499512672,
                                                        args: {},
                                                      },
                                                      children: [
                                                        {
                                                          id: 83,
                                                          line: {
                                                            pid: 1,
                                                            tid: 1,
                                                            ph: 'X',
                                                            cat: 'program',
                                                            ts: 2908073.563992977,
                                                            name: 'findSourceFile',
                                                            dur: 52738.62600326538,
                                                            args: {},
                                                          },
                                                          children: [
                                                            {
                                                              id: 84,
                                                              line: {
                                                                pid: 1,
                                                                tid: 1,
                                                                ph: 'X',
                                                                cat: 'program',
                                                                ts: 2948126.0830163956,
                                                                name: 'findSourceFile',
                                                                dur: 12595.806986093521,
                                                                args: {},
                                                              },
                                                              children: [],
                                                              types: [],
                                                              childTypeCnt: 0,
                                                            },
                                                          ],
                                                          types: [],
                                                          childTypeCnt: 0,
                                                        },
                                                        {
                                                          id: 85,
                                                          line: {
                                                            pid: 1,
                                                            tid: 1,
                                                            ph: 'X',
                                                            cat: 'program',
                                                            ts: 2968806.3940107822,
                                                            name: 'resolveLibrary',
                                                            dur: 3394.4009840488434,
                                                            args: {},
                                                          },
                                                          children: [],
                                                          types: [],
                                                          childTypeCnt: 0,
                                                        },
                                                      ],
                                                      types: [],
                                                      childTypeCnt: 0,
                                                    },
                                                  ],
                                                  types: [],
                                                  childTypeCnt: 0,
                                                },
                                                {
                                                  id: 86,
                                                  line: {
                                                    pid: 1,
                                                    tid: 1,
                                                    ph: 'X',
                                                    cat: 'program',
                                                    ts: 2979822.798997164,
                                                    name: 'findSourceFile',
                                                    dur: 730.9010028839111,
                                                    args: {},
                                                  },
                                                  children: [],
                                                  types: [],
                                                  childTypeCnt: 0,
                                                },
                                              ],
                                              types: [],
                                              childTypeCnt: 0,
                                            },
                                          ],
                                          types: [],
                                          childTypeCnt: 0,
                                        },
                                        {
                                          id: 87,
                                          line: {
                                            pid: 1,
                                            tid: 1,
                                            ph: 'X',
                                            cat: 'program',
                                            ts: 2989407.7039957047,
                                            name: 'resolveLibrary',
                                            dur: 9393.60499382019,
                                            args: {},
                                          },
                                          children: [],
                                          types: [],
                                          childTypeCnt: 0,
                                        },
                                        {
                                          id: 88,
                                          line: {
                                            pid: 1,
                                            tid: 1,
                                            ph: 'X',
                                            cat: 'program',
                                            ts: 2999916.3089990616,
                                            name: 'resolveLibrary',
                                            dur: 271.3000178337097,
                                            args: {},
                                          },
                                          children: [],
                                          types: [],
                                          childTypeCnt: 0,
                                        },
                                      ],
                                      types: [],
                                      childTypeCnt: 0,
                                    },
                                    {
                                      id: 89,
                                      line: {
                                        pid: 1,
                                        tid: 1,
                                        ph: 'X',
                                        cat: 'program',
                                        ts: 3000901.2100100517,
                                        name: 'findSourceFile',
                                        dur: 11387.205004692078,
                                        args: {},
                                      },
                                      children: [
                                        {
                                          id: 90,
                                          line: {
                                            pid: 1,
                                            tid: 1,
                                            ph: 'X',
                                            cat: 'program',
                                            ts: 3003294.0109968185,
                                            name: 'findSourceFile',
                                            dur: 8939.004004001617,
                                            args: {},
                                          },
                                          children: [],
                                          types: [],
                                          childTypeCnt: 0,
                                        },
                                      ],
                                      types: [],
                                      childTypeCnt: 0,
                                    },
                                  ],
                                  types: [],
                                  childTypeCnt: 0,
                                },
                              ],
                              types: [],
                              childTypeCnt: 0,
                            },
                          ],
                          types: [],
                          childTypeCnt: 0,
                        },
                      ],
                      types: [],
                      childTypeCnt: 0,
                    },
                  ],
                  types: [],
                  childTypeCnt: 0,
                },
                {
                  id: 91,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 3019655.319005251,
                    name: 'processTypeReferenceDirective',
                    dur: 2258.7009966373444,
                    args: {},
                  },
                  children: [
                    {
                      id: 92,
                      line: {
                        pid: 1,
                        tid: 1,
                        ph: 'X',
                        cat: 'program',
                        ts: 3019662.3190045357,
                        name: 'findSourceFile',
                        dur: 2206.9009840488434,
                        args: {},
                      },
                      children: [],
                      types: [],
                      childTypeCnt: 0,
                    },
                  ],
                  types: [],
                  childTypeCnt: 0,
                },
                {
                  id: 93,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 3023794.620990753,
                    name: 'processTypeReferenceDirective',
                    dur: 37959.019005298615,
                    args: {},
                  },
                  children: [
                    {
                      id: 94,
                      line: {
                        pid: 1,
                        tid: 1,
                        ph: 'X',
                        cat: 'program',
                        ts: 3023816.1210119724,
                        name: 'findSourceFile',
                        dur: 37898.21898937225,
                        args: {},
                      },
                      children: [
                        {
                          id: 95,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 3029861.923992634,
                            name: 'findSourceFile',
                            dur: 444.60001587867737,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 96,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 3031180.925011635,
                            name: 'findSourceFile',
                            dur: 10227.604985237122,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 97,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 3047020.6330120564,
                            name: 'findSourceFile',
                            dur: 4695.40199637413,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                        {
                          id: 98,
                          line: {
                            pid: 1,
                            tid: 1,
                            ph: 'X',
                            cat: 'program',
                            ts: 3059821.038991213,
                            name: 'findSourceFile',
                            dur: 461.7000222206116,
                            args: {},
                          },
                          children: [],
                          types: [],
                          childTypeCnt: 0,
                        },
                      ],
                      types: [],
                      childTypeCnt: 0,
                    },
                  ],
                  types: [],
                  childTypeCnt: 0,
                },
                {
                  id: 99,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 3061842.6400125027,
                    name: 'processTypeReferenceDirective',
                    dur: 117500.15798211098,
                    args: {},
                  },
                  children: [
                    {
                      id: 100,
                      line: {
                        pid: 1,
                        tid: 1,
                        ph: 'X',
                        cat: 'program',
                        ts: 3061850.14000535,
                        name: 'findSourceFile',
                        dur: 117427.25798487663,
                        args: {},
                      },
                      children: [],
                      types: [],
                      childTypeCnt: 0,
                    },
                  ],
                  types: [],
                  childTypeCnt: 0,
                },
                {
                  id: 101,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 3179389.9979889393,
                    name: 'processTypeReferenceDirective',
                    dur: 1613.7010157108307,
                    args: {},
                  },
                  children: [
                    {
                      id: 102,
                      line: {
                        pid: 1,
                        tid: 1,
                        ph: 'X',
                        cat: 'program',
                        ts: 3179411.197990179,
                        name: 'findSourceFile',
                        dur: 1541.2010252475739,
                        args: {},
                      },
                      children: [],
                      types: [],
                      childTypeCnt: 0,
                    },
                  ],
                  types: [],
                  childTypeCnt: 0,
                },
              ],
              types: [],
              childTypeCnt: 0,
            },
            {
              id: 103,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'program',
                ts: 3182906.599998474,
                name: 'findSourceFile',
                dur: 13256.907016038895,
                args: {},
              },
              children: [
                {
                  id: 104,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'program',
                    ts: 3188032.1030020714,
                    name: 'resolveLibrary',
                    dur: 2125.2009868621826,
                    args: {},
                  },
                  children: [],
                  types: [],
                  childTypeCnt: 0,
                },
              ],
              types: [],
              childTypeCnt: 0,
            },
            {
              id: 105,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'checkTypes',
                ts: 3659629.236996174,
                name: 'structuredTypeRelatedTo',
                dur: 1356.7010164260864,
                args: {},
              },
              children: [
                {
                  id: 106,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'checkTypes',
                    ts: 3659932.3370158672,
                    name: 'structuredTypeRelatedTo',
                    dur: 141.59998297691345,
                    args: {},
                  },
                  children: [],
                  types: [],
                  childTypeCnt: 0,
                },
              ],
              types: [],
              childTypeCnt: 0,
            },
            {
              id: 107,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'checkTypes',
                ts: 3668407.5410068035,
                name: 'structuredTypeRelatedTo',
                dur: 5034.7029864788055,
                args: {},
              },
              children: [],
              types: [
                {
                  id: 256,
                  recursionId: 217,
                  flags: [
                    'Index',
                    'IncludesNonWideningType',
                  ],
                  ts: 3668719.440996647,
                },
                {
                  id: 257,
                  recursionId: 218,
                  flags: [
                    'Conditional',
                    'IncludesEmptyObject',
                  ],
                  ts: 3671075.942993164,
                },
                {
                  id: 258,
                  recursionId: 219,
                  flags: [
                    'Index',
                    'IncludesNonWideningType',
                  ],
                  ts: 3672157.94301033,
                },
                {
                  id: 259,
                  recursionId: 218,
                  flags: [
                    'Conditional',
                    'IncludesEmptyObject',
                  ],
                  ts: 3672165.742993355,
                },
                {
                  id: 260,
                  recursionId: 81,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3672276.942998171,
                },
                {
                  id: 261,
                  recursionId: 208,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3672358.2429885864,
                },
                {
                  id: 262,
                  recursionId: 220,
                  flags: [
                    'Index',
                    'IncludesNonWideningType',
                  ],
                  ts: 3672368.542999029,
                },
                {
                  id: 263,
                  recursionId: 221,
                  flags: [
                    'Intersection',
                  ],
                  ts: 3672503.843009472,
                },
                {
                  id: 264,
                  recursionId: 222,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3672517.042994499,
                },
                {
                  id: 265,
                  recursionId: 223,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3672562.7430081367,
                },
                {
                  id: 266,
                  recursionId: 218,
                  flags: [
                    'Conditional',
                    'IncludesEmptyObject',
                  ],
                  ts: 3672641.6430175304,
                },
                {
                  id: 267,
                  recursionId: 224,
                  flags: [
                    'Intersection',
                  ],
                  ts: 3672826.342999935,
                },
                {
                  id: 268,
                  recursionId: 222,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3672841.042995453,
                },
                {
                  id: 269,
                  recursionId: 223,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3672856.2430143356,
                },
                {
                  id: 270,
                  recursionId: 218,
                  flags: [
                    'Conditional',
                    'IncludesEmptyObject',
                  ],
                  ts: 3672917.9430007935,
                },
                {
                  id: 271,
                  recursionId: 225,
                  flags: [
                    'Intersection',
                  ],
                  ts: 3673104.0439903736,
                },
                {
                  id: 272,
                  recursionId: 222,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3673116.3440048695,
                },
                {
                  id: 273,
                  recursionId: 223,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3673135.4440152645,
                },
                {
                  id: 274,
                  recursionId: 218,
                  flags: [
                    'Conditional',
                    'IncludesEmptyObject',
                  ],
                  ts: 3673192.6440000534,
                },
                {
                  id: 275,
                  recursionId: 226,
                  flags: [
                    'Intersection',
                  ],
                  ts: 3673389.9440169334,
                },
                {
                  id: 276,
                  recursionId: 222,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3673399.744004011,
                },
                {
                  id: 277,
                  recursionId: 223,
                  flags: [
                    'IndexedAccess',
                    'IncludesWildcard',
                  ],
                  ts: 3673409.4440042973,
                },
              ],
              childTypeCnt: 0,
            },
            {
              id: 108,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3679582.8469991684,
                name: 'checkVariableDeclaration',
                dur: 4510.601997375488,
                args: {
                  kind: 260,
                  pos: 1067,
                  end: 1131,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                },
              },
              children: [
                {
                  id: 109,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'check',
                    ts: 3679702.647000551,
                    name: 'checkExpression',
                    dur: 929.8999905586243,
                    args: {
                      kind: 80,
                      pos: 1083,
                      end: 1091,
                      path: '/home/hw/projects/tracer/playground/index.ts',
                      results: {
                        typeId: 302,
                      },
                    },
                  },
                  children: [],
                  types: [
                    {
                      id: 304,
                      recursionId: 238,
                      flags: [
                        'Union',
                      ],
                      ts: 3680349.247008562,
                    },
                  ],
                  childTypeCnt: 0,
                },
              ],
              types: [
                {
                  id: 305,
                  recursionId: 207,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3680904.7470092773,
                },
                {
                  id: 306,
                  recursionId: 208,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3680906.6469967365,
                },
                {
                  id: 307,
                  recursionId: 209,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3680911.047011614,
                },
                {
                  id: 308,
                  recursionId: 210,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3680914.247006178,
                },
                {
                  id: 309,
                  recursionId: 239,
                  flags: [
                    'Object',
                  ],
                  ts: 3681832.047998905,
                  display: '{ Output: number; }',
                },
                {
                  id: 310,
                  recursionId: 240,
                  flags: [
                    'Object',
                  ],
                  ts: 3681892.248004675,
                },
                {
                  id: 311,
                  recursionId: 241,
                  flags: [
                    'Object',
                  ],
                  ts: 3681942.84799695,
                  display: '{ Error: Error; }',
                },
                {
                  id: 312,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3682810.0480139256,
                },
                {
                  id: 313,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3682812.5480115414,
                },
                {
                  id: 314,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3682852.347999811,
                },
                {
                  id: 315,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3682853.8480103016,
                },
                {
                  id: 316,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3682881.1480104923,
                },
                {
                  id: 317,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3682882.2480142117,
                },
                {
                  id: 318,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3682900.9480178356,
                },
                {
                  id: 319,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3682901.847988367,
                },
                {
                  id: 320,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3683930.748999119,
                },
                {
                  id: 321,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3683949.1490125656,
                },
              ],
              childTypeCnt: 1,
            },
            {
              id: 110,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3689489.0519976616,
                name: 'checkVariableDeclaration',
                dur: 1167.1999990940094,
                args: {
                  kind: 260,
                  pos: 1427,
                  end: 1479,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                },
              },
              children: [
                {
                  id: 111,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'check',
                    ts: 3689677.8520047665,
                    name: 'checkExpression',
                    dur: 870.7999885082245,
                    args: {
                      kind: 213,
                      pos: 1443,
                      end: 1479,
                      path: '/home/hw/projects/tracer/playground/index.ts',
                      results: {
                        typeId: 417,
                      },
                    },
                  },
                  children: [],
                  types: [
                    {
                      id: 407,
                      recursionId: 253,
                      flags: [
                        'Object',
                      ],
                      ts: 3689773.452013731,
                      display: '{ Output: number; }',
                    },
                    {
                      id: 408,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3689830.0519883633,
                    },
                    {
                      id: 409,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3689831.2520086765,
                    },
                    {
                      id: 410,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3690382.7520012856,
                    },
                    {
                      id: 411,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3690384.4520151615,
                    },
                    {
                      id: 412,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3690402.2519886494,
                    },
                    {
                      id: 413,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3690403.151988983,
                    },
                    {
                      id: 414,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3690415.751993656,
                    },
                    {
                      id: 415,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3690416.5520071983,
                    },
                    {
                      id: 416,
                      recursionId: 206,
                      flags: [
                        'Object',
                      ],
                      ts: 3690531.7519903183,
                    },
                    {
                      id: 417,
                      recursionId: 206,
                      flags: [
                        'Object',
                      ],
                      ts: 3690545.1520085335,
                    },
                  ],
                  childTypeCnt: 0,
                },
              ],
              types: [
                {
                  id: 402,
                  recursionId: 252,
                  flags: [
                    'Union',
                  ],
                  ts: 3689593.1520164013,
                },
                {
                  id: 403,
                  recursionId: 207,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3689664.7520065308,
                },
                {
                  id: 404,
                  recursionId: 208,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3689665.85201025,
                },
                {
                  id: 405,
                  recursionId: 209,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3689666.4519906044,
                },
                {
                  id: 406,
                  recursionId: 210,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3689666.9520139694,
                },
              ],
              childTypeCnt: 11,
            },
            {
              id: 112,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3699827.1569907665,
                name: 'checkVariableDeclaration',
                dur: 25543.21300983429,
                args: {
                  kind: 260,
                  pos: 1660,
                  end: 1714,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                },
              },
              children: [
                {
                  id: 113,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'check',
                    ts: 3700001.157015562,
                    name: 'checkExpression',
                    dur: 25221.71199321747,
                    args: {
                      kind: 213,
                      pos: 1677,
                      end: 1714,
                      path: '/home/hw/projects/tracer/playground/index.ts',
                      results: {
                        typeId: 481,
                      },
                    },
                  },
                  children: [],
                  types: [
                    {
                      id: 471,
                      recursionId: 261,
                      flags: [
                        'Object',
                      ],
                      ts: 3700250.1569986343,
                      display: '{ Output: number; }',
                    },
                    {
                      id: 472,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3700308.1569969654,
                    },
                    {
                      id: 473,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3700309.657007456,
                    },
                    {
                      id: 474,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3724842.5689935684,
                    },
                    {
                      id: 475,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3724846.469014883,
                    },
                    {
                      id: 476,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3724867.2690093517,
                    },
                    {
                      id: 477,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3724868.268996477,
                    },
                    {
                      id: 478,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3724877.669006586,
                    },
                    {
                      id: 479,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3724878.468990326,
                    },
                    {
                      id: 480,
                      recursionId: 206,
                      flags: [
                        'Object',
                      ],
                      ts: 3725209.4689905643,
                    },
                    {
                      id: 481,
                      recursionId: 206,
                      flags: [
                        'Object',
                      ],
                      ts: 3725217.768996954,
                    },
                  ],
                  childTypeCnt: 0,
                },
              ],
              types: [
                {
                  id: 466,
                  recursionId: 260,
                  flags: [
                    'Union',
                  ],
                  ts: 3699950.1570165157,
                },
                {
                  id: 467,
                  recursionId: 207,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3699989.1569912434,
                },
                {
                  id: 468,
                  recursionId: 208,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3699989.9570047855,
                },
                {
                  id: 469,
                  recursionId: 209,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3699990.4569983482,
                },
                {
                  id: 470,
                  recursionId: 210,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3699990.8570051193,
                },
              ],
              childTypeCnt: 11,
            },
            {
              id: 114,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3726304.470002651,
                name: 'checkVariableDeclaration',
                dur: 8498.603999614716,
                args: {
                  kind: 260,
                  pos: 1741,
                  end: 1795,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                },
              },
              children: [
                {
                  id: 115,
                  line: {
                    pid: 1,
                    tid: 1,
                    ph: 'X',
                    cat: 'check',
                    ts: 3726711.670011282,
                    name: 'checkExpression',
                    dur: 7923.803985118866,
                    args: {
                      kind: 213,
                      pos: 1758,
                      end: 1795,
                      path: '/home/hw/projects/tracer/playground/index.ts',
                      results: {
                        typeId: 496,
                      },
                    },
                  },
                  children: [],
                  types: [
                    {
                      id: 486,
                      recursionId: 262,
                      flags: [
                        'Object',
                      ],
                      ts: 3726799.270004034,
                      display: '{ Output: number; }',
                    },
                    {
                      id: 487,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3726878.769993782,
                    },
                    {
                      id: 488,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3726880.070000887,
                    },
                    {
                      id: 489,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3734419.8740124702,
                    },
                    {
                      id: 490,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3734424.2739975452,
                    },
                    {
                      id: 491,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3734443.874001503,
                    },
                    {
                      id: 492,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3734444.674015045,
                    },
                    {
                      id: 493,
                      recursionId: 78,
                      flags: [
                        'Object',
                      ],
                      ts: 3734453.3739984035,
                    },
                    {
                      id: 494,
                      recursionId: 76,
                      flags: [
                        'TypeParameter',
                        'IncludesMissingType',
                      ],
                      ts: 3734454.1740119457,
                    },
                    {
                      id: 495,
                      recursionId: 206,
                      flags: [
                        'Object',
                      ],
                      ts: 3734624.574005604,
                    },
                    {
                      id: 496,
                      recursionId: 206,
                      flags: [
                        'Object',
                      ],
                      ts: 3734630.8740079403,
                    },
                  ],
                  childTypeCnt: 0,
                },
              ],
              types: [
                {
                  id: 482,
                  recursionId: 207,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3726696.469992399,
                },
                {
                  id: 483,
                  recursionId: 208,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3726697.870016098,
                },
                {
                  id: 484,
                  recursionId: 209,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3726698.4699964523,
                },
                {
                  id: 485,
                  recursionId: 210,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3726698.969990015,
                },
              ],
              childTypeCnt: 11,
            },
          ],
          types: [
            {
              id: 1,
              intrinsicName: 'any',
              recursionId: 0,
              flags: [
                'Any',
              ],
              ts: 3215560.216009617,
            },
            {
              id: 2,
              intrinsicName: 'any',
              recursionId: 1,
              flags: [
                'Any',
              ],
              ts: 3215578.415989876,
            },
            {
              id: 3,
              intrinsicName: 'any',
              recursionId: 2,
              flags: [
                'Any',
              ],
              ts: 3215581.8160176277,
            },
            {
              id: 4,
              intrinsicName: 'any',
              recursionId: 3,
              flags: [
                'Any',
              ],
              ts: 3215584.416002035,
            },
            {
              id: 5,
              intrinsicName: 'error',
              recursionId: 4,
              flags: [
                'Any',
              ],
              ts: 3215587.316006422,
            },
            {
              id: 6,
              intrinsicName: 'unresolved',
              recursionId: 5,
              flags: [
                'Any',
              ],
              ts: 3215588.916003704,
            },
            {
              id: 7,
              intrinsicName: 'any',
              recursionId: 6,
              flags: [
                'Any',
              ],
              ts: 3215592.4159884453,
            },
            {
              id: 8,
              intrinsicName: 'intrinsic',
              recursionId: 7,
              flags: [
                'Any',
              ],
              ts: 3215594.316005707,
            },
            {
              id: 9,
              intrinsicName: 'unknown',
              recursionId: 8,
              flags: [
                'Unknown',
              ],
              ts: 3215601.415991783,
            },
            {
              id: 10,
              intrinsicName: 'undefined',
              recursionId: 9,
              flags: [
                'Undefined',
              ],
              ts: 3215619.2159950733,
            },
            {
              id: 11,
              intrinsicName: 'undefined',
              recursionId: 10,
              flags: [
                'Undefined',
              ],
              ts: 3215638.2159888744,
            },
            {
              id: 12,
              intrinsicName: 'undefined',
              recursionId: 11,
              flags: [
                'Undefined',
              ],
              ts: 3215640.816003084,
            },
            {
              id: 13,
              intrinsicName: 'null',
              recursionId: 12,
              flags: [
                'Null',
              ],
              ts: 3215642.3160135746,
            },
            {
              id: 14,
              intrinsicName: 'string',
              recursionId: 13,
              flags: [
                'String',
              ],
              ts: 3215643.9160108566,
            },
            {
              id: 15,
              intrinsicName: 'number',
              recursionId: 14,
              flags: [
                'Number',
              ],
              ts: 3215645.1160013676,
            },
            {
              id: 16,
              intrinsicName: 'bigint',
              recursionId: 15,
              flags: [
                'BigInt',
              ],
              ts: 3215646.3159918785,
            },
            {
              id: 17,
              intrinsicName: 'false',
              recursionId: 16,
              flags: [
                'BooleanLiteral',
              ],
              ts: 3215648.3159959316,
              display: 'false',
            },
            {
              id: 18,
              intrinsicName: 'false',
              recursionId: 17,
              flags: [
                'BooleanLiteral',
              ],
              ts: 3215651.116013527,
              display: 'false',
            },
            {
              id: 19,
              intrinsicName: 'true',
              recursionId: 18,
              flags: [
                'BooleanLiteral',
              ],
              ts: 3215655.4160118103,
              display: 'true',
            },
            {
              id: 20,
              intrinsicName: 'true',
              recursionId: 19,
              flags: [
                'BooleanLiteral',
              ],
              ts: 3215657.115995884,
              display: 'true',
            },
            {
              id: 21,
              intrinsicName: 'boolean',
              recursionId: 20,
              flags: [
                'Boolean',
                'BooleanLike',
                'PossiblyFalsy',
                'Union',
              ],
              ts: 3216261.5170180798,
            },
            {
              id: 22,
              intrinsicName: 'symbol',
              recursionId: 21,
              flags: [
                'ESSymbol',
              ],
              ts: 3216341.6170179844,
            },
            {
              id: 23,
              intrinsicName: 'void',
              recursionId: 22,
              flags: [
                'Void',
              ],
              ts: 3216344.91699934,
            },
            {
              id: 24,
              intrinsicName: 'never',
              recursionId: 23,
              flags: [
                'Never',
              ],
              ts: 3216346.516996622,
            },
            {
              id: 25,
              intrinsicName: 'never',
              recursionId: 24,
              flags: [
                'Never',
              ],
              ts: 3216348.217010498,
            },
            {
              id: 26,
              intrinsicName: 'never',
              recursionId: 25,
              flags: [
                'Never',
              ],
              ts: 3216350.4170179367,
            },
            {
              id: 27,
              intrinsicName: 'never',
              recursionId: 26,
              flags: [
                'Never',
              ],
              ts: 3216351.7169952393,
            },
            {
              id: 28,
              intrinsicName: 'object',
              recursionId: 27,
              flags: [
                'NonPrimitive',
              ],
              ts: 3216353.017002344,
            },
            {
              id: 29,
              recursionId: 28,
              flags: [
                'Union',
              ],
              ts: 3216367.5169944763,
            },
            {
              id: 30,
              recursionId: 29,
              flags: [
                'Union',
              ],
              ts: 3216379.3170154095,
            },
            {
              id: 31,
              recursionId: 30,
              flags: [
                'Union',
              ],
              ts: 3216387.116998434,
            },
            {
              id: 32,
              recursionId: 31,
              flags: [
                'Union',
              ],
              ts: 3216578.5169899464,
            },
            {
              id: 33,
              recursionId: 32,
              flags: [
                'TemplateLiteral',
              ],
              ts: 3217145.5169916153,
            },
            {
              id: 34,
              intrinsicName: 'never',
              recursionId: 33,
              flags: [
                'Never',
              ],
              ts: 3217226.117014885,
            },
            {
              id: 35,
              recursionId: 34,
              flags: [
                'Object',
              ],
              ts: 3217287.31700778,
              display: '{}',
            },
            {
              id: 36,
              recursionId: 35,
              flags: [
                'Object',
              ],
              ts: 3217335.7169926167,
              display: '{}',
            },
            {
              id: 37,
              recursionId: 36,
              flags: [
                'Object',
              ],
              ts: 3217351.7169952393,
              display: '{}',
            },
            {
              id: 38,
              recursionId: 37,
              flags: [
                'Object',
              ],
              ts: 3217353.7169992924,
              display: '{}',
            },
            {
              id: 39,
              recursionId: 38,
              flags: [
                'Union',
              ],
              ts: 3217500.2169907093,
            },
            {
              id: 40,
              recursionId: 39,
              flags: [
                'Object',
              ],
              ts: 3217510.617017746,
              display: '{}',
            },
            {
              id: 41,
              recursionId: 40,
              flags: [
                'Object',
              ],
              ts: 3217520.716995001,
              display: '{}',
            },
            {
              id: 42,
              recursionId: 41,
              flags: [
                'Object',
              ],
              ts: 3217522.716999054,
              display: '{}',
            },
            {
              id: 43,
              recursionId: 42,
              flags: [
                'Object',
              ],
              ts: 3217524.017006159,
              display: '{}',
            },
            {
              id: 44,
              recursionId: 43,
              flags: [
                'Object',
              ],
              ts: 3217525.21699667,
              display: '{}',
            },
            {
              id: 45,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3217554.6170175076,
            },
            {
              id: 46,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3217559.0170025826,
            },
            {
              id: 47,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3217563.5170042515,
            },
            {
              id: 48,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3217564.3170177937,
            },
            {
              id: 49,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3217565.017014742,
            },
            {
              id: 50,
              recursionId: 44,
              flags: [
                'StringLiteral',
              ],
              ts: 3218399.8180031776,
              display: '""',
            },
            {
              id: 51,
              recursionId: 45,
              flags: [
                'NumberLiteral',
              ],
              ts: 3218435.9180033207,
              display: '0',
            },
            {
              id: 52,
              recursionId: 46,
              flags: [
                'BigIntLiteral',
              ],
              ts: 3218494.318008423,
              display: '0n',
            },
            {
              id: 53,
              recursionId: 47,
              flags: [
                'StringLiteral',
              ],
              ts: 3218532.9180061817,
              display: '"string"',
            },
            {
              id: 54,
              recursionId: 48,
              flags: [
                'StringLiteral',
              ],
              ts: 3218536.817997694,
              display: '"number"',
            },
            {
              id: 55,
              recursionId: 49,
              flags: [
                'StringLiteral',
              ],
              ts: 3218538.6179983616,
              display: '"bigint"',
            },
            {
              id: 56,
              recursionId: 50,
              flags: [
                'StringLiteral',
              ],
              ts: 3218540.118008852,
              display: '"boolean"',
            },
            {
              id: 57,
              recursionId: 51,
              flags: [
                'StringLiteral',
              ],
              ts: 3218542.8180098534,
              display: '"symbol"',
            },
            {
              id: 58,
              recursionId: 52,
              flags: [
                'StringLiteral',
              ],
              ts: 3218544.3179905415,
              display: '"undefined"',
            },
            {
              id: 59,
              recursionId: 53,
              flags: [
                'StringLiteral',
              ],
              ts: 3218550.8179962635,
              display: '"object"',
            },
            {
              id: 60,
              recursionId: 54,
              flags: [
                'StringLiteral',
              ],
              ts: 3218556.717991829,
              display: '"function"',
            },
            {
              id: 61,
              recursionId: 55,
              flags: [
                'Union',
              ],
              ts: 3218609.2180013657,
            },
            {
              id: 62,
              recursionId: 56,
              flags: [
                'Object',
              ],
              ts: 3629722.721993923,
            },
            {
              id: 63,
              recursionId: 57,
              flags: [
                'Object',
              ],
              ts: 3630262.8220021725,
              display: 'typeof globalThis',
            },
            {
              id: 64,
              recursionId: 58,
              flags: [
                'Object',
              ],
              ts: 3630409.622013569,
            },
            {
              id: 65,
              recursionId: 59,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3630489.0220165253,
            },
            {
              id: 66,
              recursionId: 58,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3630609.221994877,
            },
            {
              id: 67,
              recursionId: 60,
              flags: [
                'Object',
              ],
              ts: 3630660.322010517,
            },
            {
              id: 68,
              recursionId: 61,
              flags: [
                'Object',
              ],
              ts: 3630681.522011757,
            },
            {
              id: 69,
              recursionId: 62,
              flags: [
                'Object',
              ],
              ts: 3630703.9220035076,
            },
            {
              id: 70,
              recursionId: 63,
              flags: [
                'Object',
              ],
              ts: 3631406.1230123043,
            },
            {
              id: 71,
              recursionId: 64,
              flags: [
                'Object',
              ],
              ts: 3631566.523015499,
            },
            {
              id: 72,
              recursionId: 65,
              flags: [
                'Object',
              ],
              ts: 3631646.923005581,
            },
            {
              id: 73,
              recursionId: 66,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3631665.922999382,
            },
            {
              id: 74,
              recursionId: 65,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3631674.023002386,
            },
            {
              id: 75,
              recursionId: 64,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3631678.923010826,
            },
            {
              id: 76,
              recursionId: 67,
              flags: [
                'Object',
              ],
              ts: 3631689.422994852,
            },
            {
              id: 77,
              recursionId: 68,
              flags: [
                'Object',
              ],
              ts: 3631709.6230089664,
            },
            {
              id: 78,
              recursionId: 69,
              flags: [
                'Object',
              ],
              ts: 3631723.922997713,
            },
            {
              id: 79,
              recursionId: 69,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3631732.623010874,
            },
            {
              id: 80,
              recursionId: 58,
              flags: [
                'Object',
              ],
              ts: 3631828.5230100155,
            },
            {
              id: 81,
              recursionId: 58,
              flags: [
                'Object',
              ],
              ts: 3631846.523016691,
            },
            {
              id: 82,
              recursionId: 70,
              flags: [
                'Object',
              ],
              ts: 3631881.422996521,
            },
            {
              id: 83,
              recursionId: 71,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3631889.223009348,
            },
            {
              id: 84,
              recursionId: 70,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3632017.3230171204,
            },
            {
              id: 85,
              recursionId: 70,
              flags: [
                'Object',
              ],
              ts: 3632031.522989273,
            },
            {
              id: 86,
              recursionId: 72,
              flags: [
                'Object',
              ],
              ts: 3632042.4230098724,
            },
            {
              id: 87,
              recursionId: 73,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3632054.6230077744,
            },
            {
              id: 88,
              recursionId: 72,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3632068.123012781,
            },
            {
              id: 89,
              recursionId: 74,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3635272.8250026703,
            },
            {
              id: 90,
              recursionId: 75,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3636269.5249915123,
            },
            {
              id: 91,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3637549.9260127544,
            },
            {
              id: 92,
              recursionId: 77,
              flags: [
                'Index',
                'IncludesNonWideningType',
              ],
              ts: 3637971.726000309,
            },
            {
              id: 93,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3638216.3259983063,
            },
            {
              id: 94,
              recursionId: 79,
              flags: [
                'Index',
                'IncludesNonWideningType',
              ],
              ts: 3638756.8260133266,
            },
            {
              id: 95,
              recursionId: 80,
              flags: [
                'Substitution',
                'IncludesInstantiable',
              ],
              ts: 3639216.9269919395,
            },
            {
              id: 96,
              recursionId: 81,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3639720.6270098686,
            },
            {
              id: 97,
              recursionId: 82,
              flags: [
                'Intersection',
              ],
              ts: 3640832.6280117035,
            },
            {
              id: 98,
              recursionId: 83,
              flags: [
                'Object',
              ],
              ts: 3644342.42901206,
            },
            {
              id: 99,
              recursionId: 84,
              flags: [
                'UniqueESSymbol',
              ],
              ts: 3648292.331010103,
            },
            {
              id: 100,
              recursionId: 65,
              flags: [
                'Object',
              ],
              ts: 3650566.5320158005,
            },
            {
              id: 101,
              recursionId: 65,
              flags: [
                'Object',
              ],
              ts: 3650834.4320058823,
            },
            {
              id: 102,
              recursionId: 85,
              flags: [
                'Object',
              ],
              ts: 3651797.832995653,
            },
            {
              id: 103,
              recursionId: 86,
              flags: [
                'UniqueESSymbol',
              ],
              ts: 3652031.0330092907,
            },
            {
              id: 104,
              recursionId: 87,
              flags: [
                'UniqueESSymbol',
              ],
              ts: 3652367.9330050945,
            },
            {
              id: 105,
              recursionId: 88,
              flags: [
                'Object',
              ],
              ts: 3652629.932999611,
              display: '() => string',
            },
            {
              id: 106,
              recursionId: 89,
              flags: [
                'Object',
              ],
              ts: 3652722.6330041885,
              display: '(radix?: number | undefined) => string',
            },
            {
              id: 107,
              recursionId: 90,
              flags: [
                'Object',
              ],
              ts: 3652729.0329933167,
              display: '() => string',
            },
            {
              id: 108,
              recursionId: 91,
              flags: [
                'StringLiteral',
              ],
              ts: 3652952.134013176,
              display: '"charAt"',
            },
            {
              id: 109,
              recursionId: 92,
              flags: [
                'Object',
              ],
              ts: 3653088.6340141296,
              display: '(pos: number) => string',
            },
            {
              id: 110,
              recursionId: 93,
              flags: [
                'StringLiteral',
              ],
              ts: 3653126.8340051174,
              display: '"charCodeAt"',
            },
            {
              id: 111,
              recursionId: 94,
              flags: [
                'Object',
              ],
              ts: 3653139.4340097904,
              display: '(index: number) => number',
            },
            {
              id: 112,
              recursionId: 95,
              flags: [
                'StringLiteral',
              ],
              ts: 3653157.434016466,
              display: '"concat"',
            },
            {
              id: 113,
              recursionId: 96,
              flags: [
                'Object',
              ],
              ts: 3653166.8339967728,
              display: '(...strings: string[]) => string',
            },
            {
              id: 114,
              recursionId: 97,
              flags: [
                'StringLiteral',
              ],
              ts: 3653181.6340088844,
              display: '"indexOf"',
            },
            {
              id: 115,
              recursionId: 98,
              flags: [
                'Object',
              ],
              ts: 3653307.63399601,
              display: '(searchString: string, position?: number | undefined) => number',
            },
            {
              id: 116,
              recursionId: 99,
              flags: [
                'StringLiteral',
              ],
              ts: 3653331.7340016365,
              display: '"lastIndexOf"',
            },
            {
              id: 117,
              recursionId: 100,
              flags: [
                'Object',
              ],
              ts: 3653350.933998823,
              display: '(searchString: string, position?: number | undefined) => number',
            },
            {
              id: 118,
              recursionId: 101,
              flags: [
                'StringLiteral',
              ],
              ts: 3653378.533989191,
              display: '"localeCompare"',
            },
            {
              id: 119,
              recursionId: 102,
              flags: [
                'Object',
              ],
              ts: 3653433.6340129375,
              display: '{ (that: string): number; (that: string, locales?: string | string[] | undefined, options?: CollatorOptions | undefined): number; (that: string, locales?: LocalesArgument, options?: CollatorOptions | undefined): number; }',
            },
            {
              id: 120,
              recursionId: 102,
              flags: [
                'Object',
              ],
              ts: 3654115.234017372,
              display: '{ (that: string): number; (that: string, locales?: string | string[] | undefined, options?: CollatorOptions | undefined): number; (that: string, locales?: LocalesArgument, options?: CollatorOptions | undefined): number; }',
            },
            {
              id: 121,
              recursionId: 103,
              flags: [
                'StringLiteral',
              ],
              ts: 3654268.4340178967,
              display: '"match"',
            },
            {
              id: 122,
              recursionId: 104,
              flags: [
                'Object',
              ],
              ts: 3654294.934004545,
              display: '{ (regexp: string | RegExp): RegExpMatchArray | null; (matcher: { [Symbol.match](string: string): RegExpMatchArray | null; }): RegExpMatchArray | null; }',
            },
            {
              id: 123,
              recursionId: 104,
              flags: [
                'Object',
              ],
              ts: 3654335.9340131283,
              display: '{ (regexp: string | RegExp): RegExpMatchArray | null; (matcher: { [Symbol.match](string: string): RegExpMatchArray | null; }): RegExpMatchArray | null; }',
            },
            {
              id: 124,
              recursionId: 105,
              flags: [
                'StringLiteral',
              ],
              ts: 3654367.233991623,
              display: '"replace"',
            },
            {
              id: 125,
              recursionId: 106,
              flags: [
                'Object',
              ],
              ts: 3654379.034012556,
              display: '{ (searchValue: string | RegExp, replaceValue: string): string; (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string; (searchValue: { ...; }, replaceValue: string): string; (searchValue: { ...; }, replacer: (substring: string, ...args: any[]) => string): string; }',
            },
            {
              id: 126,
              recursionId: 106,
              flags: [
                'Object',
              ],
              ts: 3654507.8340172768,
              display: '{ (searchValue: string | RegExp, replaceValue: string): string; (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string; (searchValue: { ...; }, replaceValue: string): string; (searchValue: { ...; }, replacer: (substring: string, ...args: any[]) => string): string; }',
            },
            {
              id: 127,
              recursionId: 107,
              flags: [
                'StringLiteral',
              ],
              ts: 3654543.1340038776,
              display: '"search"',
            },
            {
              id: 128,
              recursionId: 108,
              flags: [
                'Object',
              ],
              ts: 3654553.833991289,
              display: '{ (regexp: string | RegExp): number; (searcher: { [Symbol.search](string: string): number; }): number; }',
            },
            {
              id: 129,
              recursionId: 108,
              flags: [
                'Object',
              ],
              ts: 3654587.4339938164,
              display: '{ (regexp: string | RegExp): number; (searcher: { [Symbol.search](string: string): number; }): number; }',
            },
            {
              id: 130,
              recursionId: 109,
              flags: [
                'StringLiteral',
              ],
              ts: 3654608.8339984417,
              display: '"slice"',
            },
            {
              id: 131,
              recursionId: 110,
              flags: [
                'Object',
              ],
              ts: 3654621.1340129375,
              display: '(start?: number | undefined, end?: number | undefined) => string',
            },
            {
              id: 132,
              recursionId: 111,
              flags: [
                'StringLiteral',
              ],
              ts: 3654642.033994198,
              display: '"split"',
            },
            {
              id: 133,
              recursionId: 112,
              flags: [
                'Object',
              ],
              ts: 3654826.234012842,
              display: '{ (separator: string | RegExp, limit?: number | undefined): string[]; (splitter: { [Symbol.split](string: string, limit?: number | undefined): string[]; }, limit?: number | undefined): string[]; }',
            },
            {
              id: 134,
              recursionId: 112,
              flags: [
                'Object',
              ],
              ts: 3654860.334008932,
              display: '{ (separator: string | RegExp, limit?: number | undefined): string[]; (splitter: { [Symbol.split](string: string, limit?: number | undefined): string[]; }, limit?: number | undefined): string[]; }',
            },
            {
              id: 135,
              recursionId: 113,
              flags: [
                'StringLiteral',
              ],
              ts: 3654943.535000086,
              display: '"substring"',
            },
            {
              id: 136,
              recursionId: 114,
              flags: [
                'Object',
              ],
              ts: 3654955.7349979877,
              display: '(start: number, end?: number | undefined) => string',
            },
            {
              id: 137,
              recursionId: 115,
              flags: [
                'StringLiteral',
              ],
              ts: 3654973.834991455,
              display: '"toLowerCase"',
            },
            {
              id: 138,
              recursionId: 116,
              flags: [
                'Object',
              ],
              ts: 3654980.83499074,
              display: '() => string',
            },
            {
              id: 139,
              recursionId: 117,
              flags: [
                'StringLiteral',
              ],
              ts: 3654993.835002184,
              display: '"toLocaleLowerCase"',
            },
            {
              id: 140,
              recursionId: 118,
              flags: [
                'Object',
              ],
              ts: 3655001.035004854,
              display: '{ (locales?: string | string[] | undefined): string; (locales?: LocalesArgument): string; }',
            },
            {
              id: 141,
              recursionId: 118,
              flags: [
                'Object',
              ],
              ts: 3655026.1349976063,
              display: '{ (locales?: string | string[] | undefined): string; (locales?: LocalesArgument): string; }',
            },
            {
              id: 142,
              recursionId: 119,
              flags: [
                'StringLiteral',
              ],
              ts: 3655043.4350073338,
              display: '"toUpperCase"',
            },
            {
              id: 143,
              recursionId: 120,
              flags: [
                'Object',
              ],
              ts: 3655050.235003233,
              display: '() => string',
            },
            {
              id: 144,
              recursionId: 121,
              flags: [
                'StringLiteral',
              ],
              ts: 3655063.3350014687,
              display: '"toLocaleUpperCase"',
            },
            {
              id: 145,
              recursionId: 122,
              flags: [
                'Object',
              ],
              ts: 3655069.734990597,
              display: '{ (locales?: string | string[] | undefined): string; (locales?: LocalesArgument): string; }',
            },
            {
              id: 146,
              recursionId: 122,
              flags: [
                'Object',
              ],
              ts: 3655088.7350142,
              display: '{ (locales?: string | string[] | undefined): string; (locales?: LocalesArgument): string; }',
            },
            {
              id: 147,
              recursionId: 123,
              flags: [
                'StringLiteral',
              ],
              ts: 3655108.9349985123,
              display: '"trim"',
            },
            {
              id: 148,
              recursionId: 124,
              flags: [
                'Object',
              ],
              ts: 3655219.5349931717,
              display: '() => string',
            },
            {
              id: 149,
              recursionId: 125,
              flags: [
                'StringLiteral',
              ],
              ts: 3655240.3350174427,
              display: '"length"',
            },
            {
              id: 150,
              recursionId: 126,
              flags: [
                'StringLiteral',
              ],
              ts: 3655325.2350091934,
              display: '"substr"',
            },
            {
              id: 151,
              recursionId: 127,
              flags: [
                'Object',
              ],
              ts: 3655332.4350118637,
              display: '(from: number, length?: number | undefined) => string',
            },
            {
              id: 152,
              recursionId: 128,
              flags: [
                'Object',
              ],
              ts: 3655364.8349940777,
              display: '() => string',
            },
            {
              id: 153,
              recursionId: 129,
              flags: [
                'Object',
              ],
              ts: 3655369.134992361,
              display: '() => number',
            },
            {
              id: 154,
              recursionId: 130,
              flags: [
                'Object',
              ],
              ts: 3655372.2350001335,
              display: '() => symbol',
            },
            {
              id: 155,
              recursionId: 131,
              flags: [
                'StringLiteral',
              ],
              ts: 3655391.2349939346,
              display: '"codePointAt"',
            },
            {
              id: 156,
              recursionId: 132,
              flags: [
                'Object',
              ],
              ts: 3655400.535017252,
              display: '(pos: number) => number | undefined',
            },
            {
              id: 157,
              recursionId: 132,
              flags: [
                'Object',
              ],
              ts: 3655431.5350055695,
              display: '(pos: number) => number | undefined',
            },
            {
              id: 158,
              recursionId: 133,
              flags: [
                'StringLiteral',
              ],
              ts: 3655447.0350146294,
              display: '"includes"',
            },
            {
              id: 159,
              recursionId: 134,
              flags: [
                'Object',
              ],
              ts: 3655452.935010195,
              display: '(searchString: string, position?: number | undefined) => boolean',
            },
            {
              id: 160,
              recursionId: 135,
              flags: [
                'StringLiteral',
              ],
              ts: 3655460.8350098133,
              display: '"endsWith"',
            },
            {
              id: 161,
              recursionId: 136,
              flags: [
                'Object',
              ],
              ts: 3655465.9349918365,
              display: '(searchString: string, endPosition?: number | undefined) => boolean',
            },
            {
              id: 162,
              recursionId: 137,
              flags: [
                'StringLiteral',
              ],
              ts: 3655650.2349972725,
              display: '"normalize"',
            },
            {
              id: 163,
              recursionId: 138,
              flags: [
                'Object',
              ],
              ts: 3655699.2349922657,
              display: '{ (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string; (form?: string | undefined): string; }',
            },
            {
              id: 164,
              recursionId: 138,
              flags: [
                'Object',
              ],
              ts: 3655812.835007906,
              display: '{ (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string; (form?: string | undefined): string; }',
            },
            {
              id: 165,
              recursionId: 139,
              flags: [
                'StringLiteral',
              ],
              ts: 3655921.8350052834,
              display: '"repeat"',
            },
            {
              id: 166,
              recursionId: 140,
              flags: [
                'Object',
              ],
              ts: 3655940.135002136,
              display: '(count: number) => string',
            },
            {
              id: 167,
              recursionId: 141,
              flags: [
                'StringLiteral',
              ],
              ts: 3656061.3349974155,
              display: '"startsWith"',
            },
            {
              id: 168,
              recursionId: 142,
              flags: [
                'Object',
              ],
              ts: 3656071.335017681,
              display: '(searchString: string, position?: number | undefined) => boolean',
            },
            {
              id: 169,
              recursionId: 143,
              flags: [
                'StringLiteral',
              ],
              ts: 3656085.3350162506,
              display: '"anchor"',
            },
            {
              id: 170,
              recursionId: 144,
              flags: [
                'Object',
              ],
              ts: 3656091.8349921703,
              display: '(name: string) => string',
            },
            {
              id: 171,
              recursionId: 145,
              flags: [
                'StringLiteral',
              ],
              ts: 3656100.434988737,
              display: '"big"',
            },
            {
              id: 172,
              recursionId: 146,
              flags: [
                'Object',
              ],
              ts: 3656105.435013771,
              display: '() => string',
            },
            {
              id: 173,
              recursionId: 147,
              flags: [
                'StringLiteral',
              ],
              ts: 3656112.6350164413,
              display: '"blink"',
            },
            {
              id: 174,
              recursionId: 148,
              flags: [
                'Object',
              ],
              ts: 3656122.5349903107,
              display: '() => string',
            },
            {
              id: 175,
              recursionId: 149,
              flags: [
                'StringLiteral',
              ],
              ts: 3656134.0349912643,
              display: '"bold"',
            },
            {
              id: 176,
              recursionId: 150,
              flags: [
                'Object',
              ],
              ts: 3656139.13500309,
              display: '() => string',
            },
            {
              id: 177,
              recursionId: 151,
              flags: [
                'StringLiteral',
              ],
              ts: 3656146.434992552,
              display: '"fixed"',
            },
            {
              id: 178,
              recursionId: 152,
              flags: [
                'Object',
              ],
              ts: 3656151.2350142,
              display: '() => string',
            },
            {
              id: 179,
              recursionId: 153,
              flags: [
                'StringLiteral',
              ],
              ts: 3656158.3350002766,
              display: '"fontcolor"',
            },
            {
              id: 180,
              recursionId: 154,
              flags: [
                'Object',
              ],
              ts: 3656162.735015154,
              display: '(color: string) => string',
            },
            {
              id: 181,
              recursionId: 155,
              flags: [
                'StringLiteral',
              ],
              ts: 3656170.9350049496,
              display: '"fontsize"',
            },
            {
              id: 182,
              recursionId: 156,
              flags: [
                'Object',
              ],
              ts: 3656175.8350133896,
              display: '{ (size: number): string; (size: string): string; }',
            },
            {
              id: 183,
              recursionId: 156,
              flags: [
                'Object',
              ],
              ts: 3656221.8350172043,
              display: '{ (size: number): string; (size: string): string; }',
            },
            {
              id: 184,
              recursionId: 157,
              flags: [
                'StringLiteral',
              ],
              ts: 3656236.434996128,
              display: '"italics"',
            },
            {
              id: 185,
              recursionId: 158,
              flags: [
                'Object',
              ],
              ts: 3656242.3349916935,
              display: '() => string',
            },
            {
              id: 186,
              recursionId: 159,
              flags: [
                'StringLiteral',
              ],
              ts: 3656249.7349977493,
              display: '"link"',
            },
            {
              id: 187,
              recursionId: 160,
              flags: [
                'Object',
              ],
              ts: 3656254.435002804,
              display: '(url: string) => string',
            },
            {
              id: 188,
              recursionId: 161,
              flags: [
                'StringLiteral',
              ],
              ts: 3656358.7349951267,
              display: '"small"',
            },
            {
              id: 189,
              recursionId: 162,
              flags: [
                'Object',
              ],
              ts: 3656367.3349916935,
              display: '() => string',
            },
            {
              id: 190,
              recursionId: 163,
              flags: [
                'StringLiteral',
              ],
              ts: 3656380.8349967003,
              display: '"strike"',
            },
            {
              id: 191,
              recursionId: 164,
              flags: [
                'Object',
              ],
              ts: 3656385.834991932,
              display: '() => string',
            },
            {
              id: 192,
              recursionId: 165,
              flags: [
                'StringLiteral',
              ],
              ts: 3656396.1350023746,
              display: '"sub"',
            },
            {
              id: 193,
              recursionId: 166,
              flags: [
                'Object',
              ],
              ts: 3656401.0350108147,
              display: '() => string',
            },
            {
              id: 194,
              recursionId: 167,
              flags: [
                'StringLiteral',
              ],
              ts: 3656407.5350165367,
              display: '"sup"',
            },
            {
              id: 195,
              recursionId: 168,
              flags: [
                'Object',
              ],
              ts: 3656411.9350016117,
              display: '() => string',
            },
            {
              id: 196,
              recursionId: 169,
              flags: [
                'StringLiteral',
              ],
              ts: 3656419.935017824,
              display: '"padStart"',
            },
            {
              id: 197,
              recursionId: 170,
              flags: [
                'Object',
              ],
              ts: 3656426.7350137234,
              display: '(maxLength: number, fillString?: string | undefined) => string',
            },
            {
              id: 198,
              recursionId: 171,
              flags: [
                'StringLiteral',
              ],
              ts: 3656433.335006237,
              display: '"padEnd"',
            },
            {
              id: 199,
              recursionId: 172,
              flags: [
                'Object',
              ],
              ts: 3656437.9349946976,
              display: '(maxLength: number, fillString?: string | undefined) => string',
            },
            {
              id: 200,
              recursionId: 173,
              flags: [
                'StringLiteral',
              ],
              ts: 3656445.93501091,
              display: '"trimEnd"',
            },
            {
              id: 201,
              recursionId: 174,
              flags: [
                'Object',
              ],
              ts: 3656450.8349895477,
              display: '() => string',
            },
            {
              id: 202,
              recursionId: 175,
              flags: [
                'StringLiteral',
              ],
              ts: 3656456.9349884987,
              display: '"trimStart"',
            },
            {
              id: 203,
              recursionId: 176,
              flags: [
                'Object',
              ],
              ts: 3656461.335003376,
              display: '() => string',
            },
            {
              id: 204,
              recursionId: 177,
              flags: [
                'StringLiteral',
              ],
              ts: 3656467.435002327,
              display: '"trimLeft"',
            },
            {
              id: 205,
              recursionId: 178,
              flags: [
                'Object',
              ],
              ts: 3656471.8350172043,
              display: '() => string',
            },
            {
              id: 206,
              recursionId: 179,
              flags: [
                'StringLiteral',
              ],
              ts: 3656477.8349995613,
              display: '"trimRight"',
            },
            {
              id: 207,
              recursionId: 180,
              flags: [
                'Object',
              ],
              ts: 3656482.1349978447,
              display: '() => string',
            },
            {
              id: 208,
              recursionId: 181,
              flags: [
                'StringLiteral',
              ],
              ts: 3656488.535016775,
              display: '"matchAll"',
            },
            {
              id: 209,
              recursionId: 182,
              flags: [
                'Object',
              ],
              ts: 3656493.0349886417,
              display: '(regexp: RegExp) => IterableIterator<RegExpExecArray>',
            },
            {
              id: 210,
              recursionId: 183,
              flags: [
                'StringLiteral',
              ],
              ts: 3656499.8350143433,
              display: '"replaceAll"',
            },
            {
              id: 211,
              recursionId: 184,
              flags: [
                'Object',
              ],
              ts: 3656593.735009432,
              display: '{ (searchValue: string | RegExp, replaceValue: string): string; (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string; }',
            },
            {
              id: 212,
              recursionId: 184,
              flags: [
                'Object',
              ],
              ts: 3656626.035004854,
              display: '{ (searchValue: string | RegExp, replaceValue: string): string; (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string; }',
            },
            {
              id: 213,
              recursionId: 185,
              flags: [
                'StringLiteral',
              ],
              ts: 3656832.9350054264,
              display: '"at"',
            },
            {
              id: 214,
              recursionId: 186,
              flags: [
                'Object',
              ],
              ts: 3656845.9350168705,
              display: '(index: number) => string | undefined',
            },
            {
              id: 215,
              recursionId: 186,
              flags: [
                'Object',
              ],
              ts: 3656891.934990883,
              display: '(index: number) => string | undefined',
            },
            {
              id: 216,
              recursionId: 187,
              flags: [
                'Object',
              ],
              ts: 3656974.0360081196,
              display: '() => IterableIterator<string>',
            },
            {
              id: 217,
              recursionId: 188,
              flags: [
                'StringLiteral',
              ],
              ts: 3657019.735991955,
              display: '"toFixed"',
            },
            {
              id: 218,
              recursionId: 189,
              flags: [
                'Object',
              ],
              ts: 3657143.3359980583,
              display: '(fractionDigits?: number | undefined) => string',
            },
            {
              id: 219,
              recursionId: 190,
              flags: [
                'StringLiteral',
              ],
              ts: 3657154.036015272,
              display: '"toExponential"',
            },
            {
              id: 220,
              recursionId: 191,
              flags: [
                'Object',
              ],
              ts: 3657176.436007023,
              display: '(fractionDigits?: number | undefined) => string',
            },
            {
              id: 221,
              recursionId: 192,
              flags: [
                'StringLiteral',
              ],
              ts: 3657184.3360066414,
              display: '"toPrecision"',
            },
            {
              id: 222,
              recursionId: 193,
              flags: [
                'Object',
              ],
              ts: 3657198.736011982,
              display: '(precision?: number | undefined) => string',
            },
            {
              id: 223,
              recursionId: 194,
              flags: [
                'Object',
              ],
              ts: 3657220.63601017,
              display: '() => string',
            },
            {
              id: 224,
              recursionId: 195,
              flags: [
                'Object',
              ],
              ts: 3657225.2359986305,
              display: '{ (locales?: string | string[] | undefined, options?: NumberFormatOptions | undefined): string; (locales?: LocalesArgument, options?: NumberFormatOptions | undefined): string; }',
            },
            {
              id: 225,
              recursionId: 196,
              flags: [
                'Union',
              ],
              ts: 3657249.83599782,
            },
            {
              id: 226,
              recursionId: 197,
              flags: [
                'StringLiteral',
              ],
              ts: 3657377.3359954357,
              display: '"toLocaleString"',
            },
            {
              id: 227,
              recursionId: 198,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3659494.437009096,
            },
            {
              id: 228,
              recursionId: 199,
              flags: [
                'Object',
              ],
              ts: 3661427.938014269,
            },
            {
              id: 229,
              recursionId: 200,
              flags: [
                'Object',
              ],
              ts: 3663495.1390028,
            },
            {
              id: 230,
              recursionId: 201,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3663506.2389969826,
            },
            {
              id: 231,
              recursionId: 202,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3663510.3389918804,
            },
            {
              id: 232,
              recursionId: 203,
              flags: [
                'Index',
                'IncludesNonWideningType',
              ],
              ts: 3663636.1390054226,
            },
            {
              id: 233,
              recursionId: 200,
              flags: [
                'Object',
              ],
              ts: 3664297.3389923573,
            },
            {
              id: 234,
              recursionId: 202,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664320.8390176296,
            },
            {
              id: 235,
              recursionId: 204,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664586.7390036583,
            },
            {
              id: 236,
              recursionId: 205,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664674.4390130043,
            },
            {
              id: 237,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3664697.739005089,
            },
            {
              id: 238,
              recursionId: 206,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664709.039002657,
            },
            {
              id: 239,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3664719.139009714,
            },
            {
              id: 240,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664761.9389891624,
            },
            {
              id: 241,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664763.3390128613,
            },
            {
              id: 242,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664764.539003372,
            },
            {
              id: 243,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664765.5389904976,
            },
            {
              id: 244,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664962.339013815,
            },
            {
              id: 245,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664964.1390144825,
            },
            {
              id: 246,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664964.738994837,
            },
            {
              id: 247,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3664965.2389883995,
            },
            {
              id: 248,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3667201.7410099506,
            },
            {
              id: 249,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3667206.5410017967,
            },
            {
              id: 250,
              recursionId: 211,
              flags: [
                'StringLiteral',
              ],
              ts: 3667737.641006708,
              display: '"Output"',
            },
            {
              id: 251,
              recursionId: 212,
              flags: [
                'StringLiteral',
              ],
              ts: 3667745.6409931183,
              display: '"Error"',
            },
            {
              id: 252,
              recursionId: 213,
              flags: [
                'StringLiteral',
              ],
              ts: 3667748.9410042763,
              display: '"ResultResolverController"',
            },
            {
              id: 253,
              recursionId: 214,
              flags: [
                'StringLiteral',
              ],
              ts: 3667751.3410151005,
              display: '"ErrorResolverController"',
            },
            {
              id: 254,
              recursionId: 215,
              flags: [
                'Union',
              ],
              ts: 3667771.741002798,
            },
            {
              id: 255,
              recursionId: 216,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3667947.4410116673,
            },
            {
              id: 278,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3673759.5440149307,
            },
            {
              id: 279,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3673764.344006777,
            },
            {
              id: 280,
              recursionId: 227,
              flags: [
                'Index',
                'IncludesNonWideningType',
              ],
              ts: 3674014.243990183,
            },
            {
              id: 281,
              recursionId: 228,
              flags: [
                'Index',
                'IncludesNonWideningType',
              ],
              ts: 3674099.74399209,
            },
            {
              id: 282,
              recursionId: 218,
              flags: [
                'Conditional',
                'IncludesEmptyObject',
              ],
              ts: 3674104.4439971447,
            },
            {
              id: 283,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3674136.44400239,
            },
            {
              id: 284,
              recursionId: 229,
              flags: [
                'Index',
                'IncludesNonWideningType',
              ],
              ts: 3674138.2440030575,
            },
            {
              id: 285,
              recursionId: 230,
              flags: [
                'Intersection',
              ],
              ts: 3674307.8440129757,
            },
            {
              id: 286,
              recursionId: 231,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3674318.8439905643,
            },
            {
              id: 287,
              recursionId: 232,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3674333.8440060616,
            },
            {
              id: 288,
              recursionId: 218,
              flags: [
                'Conditional',
                'IncludesEmptyObject',
              ],
              ts: 3674363.4440004826,
            },
            {
              id: 289,
              recursionId: 233,
              flags: [
                'Intersection',
              ],
              ts: 3674437.4440014362,
            },
            {
              id: 290,
              recursionId: 231,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3674446.943998337,
            },
            {
              id: 291,
              recursionId: 232,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3674456.8440020084,
            },
            {
              id: 292,
              recursionId: 218,
              flags: [
                'Conditional',
                'IncludesEmptyObject',
              ],
              ts: 3674479.243993759,
            },
            {
              id: 293,
              recursionId: 234,
              flags: [
                'Intersection',
              ],
              ts: 3674552.444010973,
            },
            {
              id: 294,
              recursionId: 231,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3674682.64400959,
            },
            {
              id: 295,
              recursionId: 232,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3674700.0440061092,
            },
            {
              id: 296,
              recursionId: 218,
              flags: [
                'Conditional',
                'IncludesEmptyObject',
              ],
              ts: 3674732.8439950943,
            },
            {
              id: 297,
              recursionId: 235,
              flags: [
                'Intersection',
              ],
              ts: 3674913.244009018,
            },
            {
              id: 298,
              recursionId: 231,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3674930.34401536,
            },
            {
              id: 299,
              recursionId: 232,
              flags: [
                'IndexedAccess',
                'IncludesWildcard',
              ],
              ts: 3674942.6440000534,
            },
            {
              id: 300,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3675702.6450037956,
            },
            {
              id: 301,
              recursionId: 236,
              flags: [
                'Object',
              ],
              ts: 3676774.645000696,
              display: '{ Output: string; Error: string; ResultResolverController: string; ErrorResolverController: string; }',
            },
            {
              id: 302,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3676839.644998312,
            },
            {
              id: 303,
              recursionId: 237,
              flags: [
                'Object',
              ],
              ts: 3678215.346008539,
              display: '{}',
            },
            {
              id: 322,
              recursionId: 242,
              flags: [
                'Union',
              ],
              ts: 3684289.048999548,
            },
            {
              id: 323,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3684332.448989153,
            },
            {
              id: 324,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3684333.649009466,
            },
            {
              id: 325,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3684334.149003029,
            },
            {
              id: 326,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3684334.7490131855,
            },
            {
              id: 327,
              recursionId: 243,
              flags: [
                'Object',
              ],
              ts: 3684717.649012804,
              display: '{ Output: number; }',
            },
            {
              id: 328,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3684793.949007988,
            },
            {
              id: 329,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3684795.249015093,
            },
            {
              id: 330,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3684848.749011755,
            },
            {
              id: 331,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3684849.949002266,
            },
            {
              id: 332,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3684872.9490041733,
            },
            {
              id: 333,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3684873.7490177155,
            },
            {
              id: 334,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3684891.748994589,
            },
            {
              id: 335,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3684892.6489949226,
            },
            {
              id: 336,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3685119.1500127316,
            },
            {
              id: 337,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3685127.2500157356,
            },
            {
              id: 338,
              recursionId: 244,
              flags: [
                'Union',
              ],
              ts: 3685286.6500020027,
            },
            {
              id: 339,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3685321.3500082493,
            },
            {
              id: 340,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3685322.3499953747,
            },
            {
              id: 341,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3685322.9500055313,
            },
            {
              id: 342,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3685323.449999094,
            },
            {
              id: 343,
              recursionId: 245,
              flags: [
                'Object',
              ],
              ts: 3685435.3500008583,
              display: '{ Output: number; }',
            },
            {
              id: 344,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3685505.9500038624,
            },
            {
              id: 345,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3685507.5500011444,
            },
            {
              id: 346,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3685954.650014639,
            },
            {
              id: 347,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3685958.550006151,
            },
            {
              id: 348,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3685993.2500123978,
            },
            {
              id: 349,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3685994.350016117,
            },
            {
              id: 350,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3686174.7500002384,
            },
            {
              id: 351,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3686176.3499975204,
            },
            {
              id: 352,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3686465.7500088215,
            },
            {
              id: 353,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3686476.550012827,
            },
            {
              id: 354,
              recursionId: 246,
              flags: [
                'Union',
              ],
              ts: 3686702.650010586,
            },
            {
              id: 355,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3686742.8500056267,
            },
            {
              id: 356,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3686743.849992752,
            },
            {
              id: 357,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3686744.4500029087,
            },
            {
              id: 358,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3686744.9499964714,
            },
            {
              id: 359,
              recursionId: 247,
              flags: [
                'Object',
              ],
              ts: 3686872.8500008583,
              display: '{ Output: number; }',
            },
            {
              id: 360,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3686947.54999876,
            },
            {
              id: 361,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3686948.850005865,
            },
            {
              id: 362,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3687026.5499949455,
            },
            {
              id: 363,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3687027.4499952793,
            },
            {
              id: 364,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3687046.75000906,
            },
            {
              id: 365,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3687047.6500093937,
            },
            {
              id: 366,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3687163.3509993553,
            },
            {
              id: 367,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3687164.65100646,
            },
            {
              id: 368,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3687287.8510057926,
            },
            {
              id: 369,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3687295.2510118484,
            },
            {
              id: 370,
              recursionId: 248,
              flags: [
                'Union',
              ],
              ts: 3687478.2510101795,
            },
            {
              id: 371,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3687610.751003027,
            },
            {
              id: 372,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3687611.6510033607,
            },
            {
              id: 373,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3687612.351000309,
            },
            {
              id: 374,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3687612.8509938717,
            },
            {
              id: 375,
              recursionId: 249,
              flags: [
                'Object',
              ],
              ts: 3687737.75100708,
              display: '{ Output: number; }',
            },
            {
              id: 376,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3687908.9510142803,
            },
            {
              id: 377,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3687910.351008177,
            },
            {
              id: 378,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3688042.3510074615,
            },
            {
              id: 379,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3688043.2510077953,
            },
            {
              id: 380,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3688064.350992441,
            },
            {
              id: 381,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3688065.351009369,
            },
            {
              id: 382,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3688085.7509970665,
            },
            {
              id: 383,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3688086.5510106087,
            },
            {
              id: 384,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3688196.2510049343,
            },
            {
              id: 385,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3688203.3509910107,
            },
            {
              id: 386,
              recursionId: 250,
              flags: [
                'Union',
              ],
              ts: 3688486.551016569,
            },
            {
              id: 387,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3688530.9509932995,
            },
            {
              id: 388,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3688532.050997019,
            },
            {
              id: 389,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3688532.6510071754,
            },
            {
              id: 390,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3688533.251017332,
            },
            {
              id: 391,
              recursionId: 251,
              flags: [
                'Object',
              ],
              ts: 3688729.651004076,
              display: '{ Output: number; }',
            },
            {
              id: 392,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3688803.6510050297,
            },
            {
              id: 393,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3688804.9510121346,
            },
            {
              id: 394,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3689139.452010393,
            },
            {
              id: 395,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689140.9519910812,
            },
            {
              id: 396,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3689157.8519940376,
            },
            {
              id: 397,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689158.65200758,
            },
            {
              id: 398,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3689170.751988888,
            },
            {
              id: 399,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689171.4520156384,
            },
            {
              id: 400,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3689286.451995373,
            },
            {
              id: 401,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3689293.4519946575,
            },
            {
              id: 418,
              recursionId: 254,
              flags: [
                'Union',
              ],
              ts: 3690796.6519892216,
            },
            {
              id: 419,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3690825.75199008,
            },
            {
              id: 420,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3690826.6519904137,
            },
            {
              id: 421,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3690827.1520137787,
            },
            {
              id: 422,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3690827.6520073414,
            },
            {
              id: 423,
              recursionId: 255,
              flags: [
                'Object',
              ],
              ts: 3690915.9519970417,
              display: '{ Output: number; }',
            },
            {
              id: 424,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3690974.5520055294,
            },
            {
              id: 425,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3690975.6520092487,
            },
            {
              id: 426,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3692012.8529965878,
            },
            {
              id: 427,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3692014.45299387,
            },
            {
              id: 428,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3692031.053006649,
            },
            {
              id: 429,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3692031.852990389,
            },
            {
              id: 430,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3692041.552990675,
            },
            {
              id: 431,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3692042.353004217,
            },
            {
              id: 432,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3692278.153002262,
            },
            {
              id: 433,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3692285.3530049324,
            },
            {
              id: 434,
              recursionId: 256,
              flags: [
                'Union',
              ],
              ts: 3692541.653007269,
            },
            {
              id: 435,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3692572.953015566,
            },
            {
              id: 436,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3692573.8530158997,
            },
            {
              id: 437,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3692574.3530094624,
            },
            {
              id: 438,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3692574.9529898167,
            },
            {
              id: 439,
              recursionId: 257,
              flags: [
                'Object',
              ],
              ts: 3692667.953014374,
              display: '{ Output: number; }',
            },
            {
              id: 440,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3692723.9530086517,
            },
            {
              id: 441,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3692725.053012371,
            },
            {
              id: 442,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3694459.953993559,
            },
            {
              id: 443,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3694462.5540077686,
            },
            {
              id: 444,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3694479.054003954,
            },
            {
              id: 445,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3694479.854017496,
            },
            {
              id: 446,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3694492.2539889812,
            },
            {
              id: 447,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3694492.954015732,
            },
            {
              id: 448,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3694638.6539936066,
            },
            {
              id: 449,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3694645.7540094852,
            },
            {
              id: 450,
              recursionId: 258,
              flags: [
                'Union',
              ],
              ts: 3694856.353998184,
            },
            {
              id: 451,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3694885.354012251,
            },
            {
              id: 452,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3694886.2540125847,
            },
            {
              id: 453,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3694886.853992939,
            },
            {
              id: 454,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3694887.4540030956,
            },
            {
              id: 455,
              recursionId: 259,
              flags: [
                'Object',
              ],
              ts: 3694982.354015112,
              display: '{ Output: number; }',
            },
            {
              id: 456,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3695036.4539921284,
            },
            {
              id: 457,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3695037.5539958477,
            },
            {
              id: 458,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3699409.6570014954,
            },
            {
              id: 459,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699413.157016039,
            },
            {
              id: 460,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3699432.457000017,
            },
            {
              id: 461,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699433.457016945,
            },
            {
              id: 462,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3699442.257016897,
            },
            {
              id: 463,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699442.9570138454,
            },
            {
              id: 464,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3699737.0570003986,
            },
            {
              id: 465,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3699745.957016945,
            },
            {
              id: 497,
              recursionId: 263,
              flags: [
                'StringLiteral',
              ],
              ts: 3735239.0739917755,
              display: '"a\\nb\\nc\\nd"',
            },
            {
              id: 498,
              recursionId: 264,
              flags: [
                'StringLiteral',
              ],
              ts: 3735281.97401762,
              display: '"a\\nb\\nc\\nd"',
            },
            {
              id: 499,
              recursionId: 265,
              flags: [
                'StringLiteral',
              ],
              ts: 3736067.3750042915,
              display: '"\\n1\\n2\\n3\\n4"',
            },
            {
              id: 500,
              recursionId: 266,
              flags: [
                'StringLiteral',
              ],
              ts: 3736070.2750086784,
              display: '"\\n1\\n2\\n3\\n4"',
            },
            {
              id: 501,
              recursionId: 267,
              flags: [
                'Union',
              ],
              ts: 3736110.574990511,
            },
            {
              id: 502,
              recursionId: 268,
              flags: [
                'Object',
              ],
              ts: 3736678.4749925137,
              display: '{}',
            },
            {
              id: 503,
              recursionId: 269,
              flags: [
                'Object',
              ],
              ts: 3737062.974989414,
              display: '{}',
            },
          ],
          childTypeCnt: 87,
        },
      ],
    },
  },
  {
    trigger: {
      startsWith: 'check',
      sourceFileName: '',
      position: 0,
      message: 'filterTree',
    },
    response: {
      message: 'showTree',
      nodes: [
        {
          id: 108,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 3679582.8469991684,
            name: 'checkVariableDeclaration',
            dur: 4510.601997375488,
            args: {
              kind: 260,
              pos: 1067,
              end: 1131,
              path: '/home/hw/projects/tracer/playground/index.ts',
            },
          },
          children: [
            {
              id: 109,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3679702.647000551,
                name: 'checkExpression',
                dur: 929.8999905586243,
                args: {
                  kind: 80,
                  pos: 1083,
                  end: 1091,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                  results: {
                    typeId: 302,
                  },
                },
              },
              children: [],
              types: [
                {
                  id: 304,
                  recursionId: 238,
                  flags: [
                    'Union',
                  ],
                  ts: 3680349.247008562,
                },
              ],
              childTypeCnt: 0,
            },
          ],
          types: [
            {
              id: 305,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3680904.7470092773,
            },
            {
              id: 306,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3680906.6469967365,
            },
            {
              id: 307,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3680911.047011614,
            },
            {
              id: 308,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3680914.247006178,
            },
            {
              id: 309,
              recursionId: 239,
              flags: [
                'Object',
              ],
              ts: 3681832.047998905,
              display: '{ Output: number; }',
            },
            {
              id: 310,
              recursionId: 240,
              flags: [
                'Object',
              ],
              ts: 3681892.248004675,
            },
            {
              id: 311,
              recursionId: 241,
              flags: [
                'Object',
              ],
              ts: 3681942.84799695,
              display: '{ Error: Error; }',
            },
            {
              id: 312,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3682810.0480139256,
            },
            {
              id: 313,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3682812.5480115414,
            },
            {
              id: 314,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3682852.347999811,
            },
            {
              id: 315,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3682853.8480103016,
            },
            {
              id: 316,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3682881.1480104923,
            },
            {
              id: 317,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3682882.2480142117,
            },
            {
              id: 318,
              recursionId: 78,
              flags: [
                'Object',
              ],
              ts: 3682900.9480178356,
            },
            {
              id: 319,
              recursionId: 76,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3682901.847988367,
            },
            {
              id: 320,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3683930.748999119,
            },
            {
              id: 321,
              recursionId: 206,
              flags: [
                'Object',
              ],
              ts: 3683949.1490125656,
            },
          ],
          childTypeCnt: 1,
        },
        {
          id: 110,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 3689489.0519976616,
            name: 'checkVariableDeclaration',
            dur: 1167.1999990940094,
            args: {
              kind: 260,
              pos: 1427,
              end: 1479,
              path: '/home/hw/projects/tracer/playground/index.ts',
            },
          },
          children: [
            {
              id: 111,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3689677.8520047665,
                name: 'checkExpression',
                dur: 870.7999885082245,
                args: {
                  kind: 213,
                  pos: 1443,
                  end: 1479,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                  results: {
                    typeId: 417,
                  },
                },
              },
              children: [],
              types: [
                {
                  id: 407,
                  recursionId: 253,
                  flags: [
                    'Object',
                  ],
                  ts: 3689773.452013731,
                  display: '{ Output: number; }',
                },
                {
                  id: 408,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3689830.0519883633,
                },
                {
                  id: 409,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3689831.2520086765,
                },
                {
                  id: 410,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3690382.7520012856,
                },
                {
                  id: 411,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3690384.4520151615,
                },
                {
                  id: 412,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3690402.2519886494,
                },
                {
                  id: 413,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3690403.151988983,
                },
                {
                  id: 414,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3690415.751993656,
                },
                {
                  id: 415,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3690416.5520071983,
                },
                {
                  id: 416,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3690531.7519903183,
                },
                {
                  id: 417,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3690545.1520085335,
                },
              ],
              childTypeCnt: 0,
            },
          ],
          types: [
            {
              id: 402,
              recursionId: 252,
              flags: [
                'Union',
              ],
              ts: 3689593.1520164013,
            },
            {
              id: 403,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689664.7520065308,
            },
            {
              id: 404,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689665.85201025,
            },
            {
              id: 405,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689666.4519906044,
            },
            {
              id: 406,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3689666.9520139694,
            },
          ],
          childTypeCnt: 11,
        },
        {
          id: 112,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 3699827.1569907665,
            name: 'checkVariableDeclaration',
            dur: 25543.21300983429,
            args: {
              kind: 260,
              pos: 1660,
              end: 1714,
              path: '/home/hw/projects/tracer/playground/index.ts',
            },
          },
          children: [
            {
              id: 113,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3700001.157015562,
                name: 'checkExpression',
                dur: 25221.71199321747,
                args: {
                  kind: 213,
                  pos: 1677,
                  end: 1714,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                  results: {
                    typeId: 481,
                  },
                },
              },
              children: [],
              types: [
                {
                  id: 471,
                  recursionId: 261,
                  flags: [
                    'Object',
                  ],
                  ts: 3700250.1569986343,
                  display: '{ Output: number; }',
                },
                {
                  id: 472,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3700308.1569969654,
                },
                {
                  id: 473,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3700309.657007456,
                },
                {
                  id: 474,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3724842.5689935684,
                },
                {
                  id: 475,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3724846.469014883,
                },
                {
                  id: 476,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3724867.2690093517,
                },
                {
                  id: 477,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3724868.268996477,
                },
                {
                  id: 478,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3724877.669006586,
                },
                {
                  id: 479,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3724878.468990326,
                },
                {
                  id: 480,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3725209.4689905643,
                },
                {
                  id: 481,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3725217.768996954,
                },
              ],
              childTypeCnt: 0,
            },
          ],
          types: [
            {
              id: 466,
              recursionId: 260,
              flags: [
                'Union',
              ],
              ts: 3699950.1570165157,
            },
            {
              id: 467,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699989.1569912434,
            },
            {
              id: 468,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699989.9570047855,
            },
            {
              id: 469,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699990.4569983482,
            },
            {
              id: 470,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3699990.8570051193,
            },
          ],
          childTypeCnt: 11,
        },
        {
          id: 114,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 3726304.470002651,
            name: 'checkVariableDeclaration',
            dur: 8498.603999614716,
            args: {
              kind: 260,
              pos: 1741,
              end: 1795,
              path: '/home/hw/projects/tracer/playground/index.ts',
            },
          },
          children: [
            {
              id: 115,
              line: {
                pid: 1,
                tid: 1,
                ph: 'X',
                cat: 'check',
                ts: 3726711.670011282,
                name: 'checkExpression',
                dur: 7923.803985118866,
                args: {
                  kind: 213,
                  pos: 1758,
                  end: 1795,
                  path: '/home/hw/projects/tracer/playground/index.ts',
                  results: {
                    typeId: 496,
                  },
                },
              },
              children: [],
              types: [
                {
                  id: 486,
                  recursionId: 262,
                  flags: [
                    'Object',
                  ],
                  ts: 3726799.270004034,
                  display: '{ Output: number; }',
                },
                {
                  id: 487,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3726878.769993782,
                },
                {
                  id: 488,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3726880.070000887,
                },
                {
                  id: 489,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3734419.8740124702,
                },
                {
                  id: 490,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3734424.2739975452,
                },
                {
                  id: 491,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3734443.874001503,
                },
                {
                  id: 492,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3734444.674015045,
                },
                {
                  id: 493,
                  recursionId: 78,
                  flags: [
                    'Object',
                  ],
                  ts: 3734453.3739984035,
                },
                {
                  id: 494,
                  recursionId: 76,
                  flags: [
                    'TypeParameter',
                    'IncludesMissingType',
                  ],
                  ts: 3734454.1740119457,
                },
                {
                  id: 495,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3734624.574005604,
                },
                {
                  id: 496,
                  recursionId: 206,
                  flags: [
                    'Object',
                  ],
                  ts: 3734630.8740079403,
                },
              ],
              childTypeCnt: 0,
            },
          ],
          types: [
            {
              id: 482,
              recursionId: 207,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3726696.469992399,
            },
            {
              id: 483,
              recursionId: 208,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3726697.870016098,
            },
            {
              id: 484,
              recursionId: 209,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3726698.4699964523,
            },
            {
              id: 485,
              recursionId: 210,
              flags: [
                'TypeParameter',
                'IncludesMissingType',
              ],
              ts: 3726698.969990015,
            },
          ],
          childTypeCnt: 11,
        },
      ],
    },
  },
]
