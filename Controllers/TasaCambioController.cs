
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class TasaCambioController : Controller
    {
        private IGenericFactory<TasaDeCambio> factory = null;
        public TasaCambioController(SaraContext db)
        {
            this.factory = new GenericFactory<TasaDeCambio>(db);
        }

        [Route("api/tasaCambio/get/{id}")]
        public IActionResult GetById(int id)
        {

            return Json(factory.GetById(id));

        }

        [Route("api/tasaCambio/firstOrDefault/{tickts}")]
        public IActionResult FirstOrDefault(long tickts)
        {
            var fecha = new DateTime(tickts).Date;
            return Json(factory.FirstOrDefault(x => x.Fecha == fecha));

        }

        [Route("api/tasaCambio/get")]
        public IActionResult Get() => Json(factory.GetAll());

        [HttpPost("api/tasaCambio/post")]
        public IActionResult Post([FromBody] TasaDeCambio tasaDeCambio)
        {

            if (tasaDeCambio.Id > 0)
                factory.Update(tasaDeCambio);
            else
                factory.Insert(tasaDeCambio);

            factory.Save();

            return Json(tasaDeCambio);

        }

        [HttpPost("api/tasaCambio/post/file")]
        public IActionResult Post(IFormFile file)
        {
           
            if (file.Length > 0)
            {
                ISheet sheet;
                using (var stream = file.OpenReadStream())
                {
                    var sFileExtension = file.FileName.Split(".").Last();

                    if (string.IsNullOrEmpty(sFileExtension))
                        return NotFound("No se encontro la extension del archivo");

                    stream.Position = 0;
                    if (sFileExtension == "xls")
                    {
                        HSSFWorkbook hssfwb = new HSSFWorkbook(stream); //This will read the Excel 97-2000 formats  
                        sheet = hssfwb.GetSheetAt(0); //get first sheet from workbook  
                    }
                    else
                    {
                        XSSFWorkbook hssfwb = new XSSFWorkbook(stream); //This will read 2007 Excel format  
                        sheet = hssfwb.GetSheetAt(0); //get first sheet from workbook   
                    }

                    IRow headerRow = sheet.GetRow(0); //Get Header Row
                    int cellCount = headerRow.LastCellNum;
                    var tasasDeCambio = new List<TasaDeCambio>();
                    for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++) //Read Excel File
                    {
                        IRow row = sheet.GetRow(i);
                        if (row == null) continue;

                        if (row.Cells.All(d => d.CellType == CellType.Blank)) continue;

                        try
                        {
                            double cambio = row.GetCell(1).NumericCellValue;
                            DateTime fecha = row.GetCell(0).DateCellValue; //DateTime.ParseExact(row.GetCell(0).DateCellValue.Date.ToString(), "dd/MM/yyyy",
                                       //Sy0stem.Globalization.CultureInfo.InvariantCulture);

                            tasasDeCambio.Add(new TasaDeCambio
                            {
                                Cambio = Convert.ToDouble(cambio),
                                Fecha = fecha
                            });

                        }
                        catch (FormatException ex)
                        {
                            return BadRequest($"Un error ocurrio");
                        }
                    }

                     factory.InsertRange(tasasDeCambio);
                     factory.Save();
                }
            }


            return Json(new
            {
                name = file.FileName,
                size = file.Length
            });

        }

        [HttpGet("api/tasaCambio/{id}/delete")]
        public IActionResult Delete(int id)
        {

            factory.Delete(id);
            var n = factory.Save();
            return Json(new { n });

        }
    }
}
