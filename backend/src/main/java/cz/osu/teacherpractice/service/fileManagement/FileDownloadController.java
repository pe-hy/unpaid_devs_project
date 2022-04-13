package cz.osu.teacherpractice.service.fileManagement;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
//import java.io.IOException;
//import java.io.InputStream;
//import java.net.URLConnection;
//
//import javax.annotation.Resource;
//import javax.servlet.http.HttpServletRequest;
//
//import lombok.SneakyThrows;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/teacher/listFiles")
//public class FileDownloadController {
//
//    @SneakyThrows
//    @GetMapping("/files/{filename:.+}/{extraVariable}")
//    @ResponseBody
//    public ResponseEntity<Resource> serveFile(@PathVariable String filename, @PathVariable String extraVariable) {
//
//        Resource file = storageService.loadAsResource(filename, extraVariable);
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
//                .body(file);
//    }
//}
