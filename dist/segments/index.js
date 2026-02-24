"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSegmentDefs = void 0;
const abs_1 = require("./abs");
const acc_1 = require("./acc");
const aig_1 = require("./aig");
const ail_1 = require("./ail");
const aip_1 = require("./aip");
const ais_1 = require("./ais");
const al1_1 = require("./al1");
const bhs_1 = require("./bhs");
const blg_1 = require("./blg");
const bts_1 = require("./bts");
const cer_1 = require("./cer");
const cti_1 = require("./cti");
const db1_1 = require("./db1");
const dg1_1 = require("./dg1");
const drg_1 = require("./drg");
const dsc_1 = require("./dsc");
const dsp_1 = require("./dsp");
const err_1 = require("./err");
const evn_1 = require("./evn");
const fac_1 = require("./fac");
const fhs_1 = require("./fhs");
const ft1_1 = require("./ft1");
const fts_1 = require("./fts");
const gol_1 = require("./gol");
const gt1_1 = require("./gt1");
const in1_1 = require("./in1");
const in2_1 = require("./in2");
const inv_1 = require("./inv");
const mrg_1 = require("./mrg");
const msa_1 = require("./msa");
const msh_1 = require("./msh");
const nds_1 = require("./nds");
const nk1_1 = require("./nk1");
const nte_1 = require("./nte");
const obr_1 = require("./obr");
const obx_1 = require("./obx");
const ods_1 = require("./ods");
const odt_1 = require("./odt");
const om1_1 = require("./om1");
const om2_1 = require("./om2");
const om3_1 = require("./om3");
const om4_1 = require("./om4");
const om5_1 = require("./om5");
const om6_1 = require("./om6");
const om7_1 = require("./om7");
const orc_1 = require("./orc");
const pcr_1 = require("./pcr");
const pd1_1 = require("./pd1");
const pdc_1 = require("./pdc");
const peo_1 = require("./peo");
const pid_1 = require("./pid");
const pr1_1 = require("./pr1");
const pra_1 = require("./pra");
const prb_1 = require("./prb");
const psh_1 = require("./psh");
const pth_1 = require("./pth");
const pv1_1 = require("./pv1");
const pv2_1 = require("./pv2");
const qrd_1 = require("./qrd");
const qrf_1 = require("./qrf");
const rgs_1 = require("./rgs");
const rol_1 = require("./rol");
const rxa_1 = require("./rxa");
const rxc_1 = require("./rxc");
const rxd_1 = require("./rxd");
const rxe_1 = require("./rxe");
const rxg_1 = require("./rxg");
const rxo_1 = require("./rxo");
const rxr_1 = require("./rxr");
const sac_1 = require("./sac");
const sch_1 = require("./sch");
const spm_1 = require("./spm");
const stf_1 = require("./stf");
const tq1_1 = require("./tq1");
const tq2_1 = require("./tq2");
const txa_1 = require("./txa");
const ub1_1 = require("./ub1");
const ub2_1 = require("./ub2");
const urd_1 = require("./urd");
const urs_1 = require("./urs");
const var_1 = require("./var");
exports.allSegmentDefs = [
    abs_1.ABSSegmentDef,
    acc_1.ACCSegmentDef,
    aig_1.AIGSegmentDef,
    ail_1.AILSegmentDef,
    aip_1.AIPSegmentDef,
    ais_1.AISSegmentDef,
    al1_1.AL1SegmentDef,
    bhs_1.BHSSegmentDef,
    blg_1.BLGSegmentDef,
    bts_1.BTSSegmentDef,
    cer_1.CERSegmentDef,
    cti_1.CTISegmentDef,
    db1_1.DB1SegmentDef,
    dg1_1.DG1SegmentDef,
    drg_1.DRGSegmentDef,
    dsc_1.DSCSegmentDef,
    dsp_1.DSPSegmentDef,
    err_1.ERRSegmentDef,
    evn_1.EVNSegmentDef,
    fac_1.FACSegmentDef,
    fhs_1.FHSSegmentDef,
    ft1_1.FT1SegmentDef,
    fts_1.FTSSegmentDef,
    gol_1.GOLSegmentDef,
    gt1_1.GT1SegmentDef,
    in1_1.IN1SegmentDef,
    in2_1.IN2SegmentDef,
    inv_1.INVSegmentDef,
    mrg_1.MRGSegmentDef,
    msa_1.MSASegmentDef,
    msh_1.MSHSegmentDef,
    nds_1.NDSSegmentDef,
    nk1_1.NK1SegmentDef,
    nte_1.NTESegmentDef,
    obr_1.OBRSegmentDef,
    obx_1.OBXSegmentDef,
    ods_1.ODSSegmentDef,
    odt_1.ODTSegmentDef,
    om1_1.OM1SegmentDef,
    om2_1.OM2SegmentDef,
    om3_1.OM3SegmentDef,
    om4_1.OM4SegmentDef,
    om5_1.OM5SegmentDef,
    om6_1.OM6SegmentDef,
    om7_1.OM7SegmentDef,
    orc_1.ORCSegmentDef,
    pcr_1.PCRSegmentDef,
    pd1_1.PD1SegmentDef,
    pdc_1.PDCSegmentDef,
    peo_1.PEOSegmentDef,
    pid_1.PIDSegmentDef,
    pr1_1.PR1SegmentDef,
    pra_1.PRASegmentDef,
    prb_1.PRBSegmentDef,
    psh_1.PSHSegmentDef,
    pth_1.PTHSegmentDef,
    pv1_1.PV1SegmentDef,
    pv2_1.PV2SegmentDef,
    qrd_1.QRDSegmentDef,
    qrf_1.QRFSegmentDef,
    rgs_1.RGSSegmentDef,
    rol_1.ROLSegmentDef,
    rxa_1.RXASegmentDef,
    rxc_1.RXCSegmentDef,
    rxd_1.RXDSegmentDef,
    rxe_1.RXESegmentDef,
    rxg_1.RXGSegmentDef,
    rxo_1.RXOSegmentDef,
    rxr_1.RXRSegmentDef,
    sac_1.SACSegmentDef,
    sch_1.SCHSegmentDef,
    spm_1.SPMSegmentDef,
    stf_1.STFSegmentDef,
    tq1_1.TQ1SegmentDef,
    tq2_1.TQ2SegmentDef,
    txa_1.TXASegmentDef,
    ub1_1.UB1SegmentDef,
    ub2_1.UB2SegmentDef,
    urd_1.URDSegmentDef,
    urs_1.URSSegmentDef,
    var_1.VARSegmentDef,
];
//# sourceMappingURL=index.js.map