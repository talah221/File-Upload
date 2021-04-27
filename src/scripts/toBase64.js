//יצירת אלמנט חדש
var file_btn = document.createElement("input");
//הוספת אטריביוטים
$(file_btn).attr("type", "file");
$(file_btn).attr("accept", ".png,.jpg");
$(file_btn).attr("multiple", "");
//הוספת פונקציה בעת שינוי
file_btn.onchange = function() {
  //
  cntFiles = this.files.length;
  if (cntFiles > 0) {
    for (loop_cntFiles = 0; loop_cntFiles < cntFiles; loop_cntFiles++) {
      var reader = new FileReader();
      reader.onload = function(event) {
        file_UploadImageFileBase64(event.target.result, 0);
      };
      //להביא רק מקום 0
      reader.readAsDataURL(this.files[loop_cntFiles]);
    }
  }
};
export default {};
