import * as ReportRepo from "../repositories/report.repo.js";

export const createReport = async (req, res, next) => {
  try {
    const filters = req.query; // you can send ?fechaInicio=2025-01-01&estadoExpediente=aprobado etc.
    const report = await ReportRepo.createReport(filters);
    res.json(report);
  } catch (err) {
    next(err);
  }
};
