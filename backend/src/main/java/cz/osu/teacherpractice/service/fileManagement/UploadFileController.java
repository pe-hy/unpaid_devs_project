package cz.osu.teacherpractice.service.fileManagement;
import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.repository.PracticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import cz.osu.teacherpractice.repository.UserRepository;

@RestController
@RequiredArgsConstructor
public class UploadFileController {

    private final UserRepository userRepository;
    private final PracticeRepository practiceRepository;

    @PostMapping("/teacher/upload")
    public ResponseEntity<FileUploadResponse> uploadFiles(Principal principal, @RequestParam("files") MultipartFile[] files) {
        try {
            Long id = userRepository.findByEmail(principal.getName()).get().getId();
            File userFolderPath = new File(FileUtil.folderPath + id);
            createDirIfNotExist(userFolderPath);
            int maxFiles = AppConfig.MAXIMUM_FILE_NUMBER_PER_USER;
            int numberOfFilesUploaded = files.length;

            long filesNum = FileUtil.getNumberOfFilesInFolder(id);
            if((filesNum + numberOfFilesUploaded) > maxFiles){
                return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                        .body(new FileUploadResponse("Byl překročen limit počtu souborů na uživatele. Maximum je: " + maxFiles));
            }

            List<String> fileNames = new ArrayList<>();

            // read and write the file to the local folder
            Arrays.asList(files).stream().forEach(file -> {
                byte[] bytes = new byte[0];
                try {
                    bytes = file.getBytes();
                    String fileName = file.getOriginalFilename();
                    File path = new File(FileUtil.folderPath + id + "//" + fileName);
                    if(fileExists(id, fileName)){
                        fileName = renameExistingFile(userFolderPath, fileName);
                    }
                    Files.write(Paths.get(FileUtil.folderPath + id + "//" + fileName), bytes);
                    fileNames.add(file.getOriginalFilename());
                } catch (IOException e) {

                }
            });

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new FileUploadResponse("Soubory byly úspěšně nahrány: " + fileNames));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .body(new FileUploadResponse("Došlo k neočekávané chybě!"));
        }
    }

    @PostMapping("/teacher/report/upload")
    public ResponseEntity<FileUploadResponse> uploadReport(Principal principal,@RequestParam("id") Long id, @RequestParam("file") MultipartFile[] files) {
        try {
            File userFolderPath = new File(FileUtil.reportsFolderPath + id);
            createDirIfNotExist(userFolderPath);
            int maxFiles = AppConfig.MAXIMUM_NUMBER_OF_REPORTS;
            int numberOfFilesUploaded = files.length;

            long filesNum = FileUtil.getNumberOfReportsInFolder(id);
            if((filesNum + numberOfFilesUploaded) > maxFiles){
                return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                        .body(new FileUploadResponse("Byl překročen limit počtu souborů na uživatele. Maximum je: " + maxFiles));
            }

            List<String> fileNames = new ArrayList<>();

            // read and write the file to the local folder
            Arrays.asList(files).stream().forEach(file -> {
                byte[] bytes = new byte[0];
                try {
                    bytes = file.getBytes();
                    String fileName = file.getOriginalFilename();
                    File path = new File(FileUtil.folderPath + id + "//" + fileName);
                    if(fileExists(id, fileName)){
                        fileName = renameExistingFile(userFolderPath, fileName);
                    }
                    Files.write(Paths.get(FileUtil.reportsFolderPath + id + "//" + fileName), bytes);
                    fileNames.add(file.getOriginalFilename());
                } catch (IOException e) {

                }
            });

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new FileUploadResponse("Soubory byly úspěšně nahrány: " + fileNames));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .body(new FileUploadResponse("Došlo k neočekávané chybě!"));
        }
    }

    /**
     * Create directory to save files, if not exist
     */
    private boolean fileExists(Long id, String fileName){
        File directory = new File(FileUtil.folderPath + "//" + id + "//" + fileName);
        return directory.exists();
    }
    private String renameExistingFile(File path, String fileName){
        int highestNumber = 1;
        File f = path;
        File[] matchingFiles = f.listFiles((dir, name) -> name.startsWith(fileName.split("\\.")[0]));
        Pattern MY_PATTERN = Pattern.compile("(\\d+)");

        assert matchingFiles != null;
        for (File file :
                matchingFiles) {
            Matcher m = MY_PATTERN.matcher(file.getName());
            while (m.find()) {
                String s = m.group(m.groupCount()-1);
                // s now contains "BAR"
                if(Integer.parseInt(s) > highestNumber) highestNumber = Integer.parseInt(s);
            }
        }
        String name = fileName.split("\\.")[0];
        String fileExtension = fileName.split("\\.")[1];
        String ret = name + "(" + (highestNumber + 1) + ")." + fileExtension;
        return ret;
    }

    private void createDirIfNotExist(File path) {
        File directory = path;
        if (!directory.exists()) {

            boolean wasSuccessful = directory.mkdirs();
            if (!wasSuccessful) {
                System.out.println("was not successful.");
            }
        }
    }

    /**
     * Method to get the list of files from the file storage folder.
     *
     * @return file
     */
    @GetMapping("/teacher/files")
    public ResponseEntity<String[]> getListFiles() {
        System.out.println("Called files list endpoint /teacher/files");
        return ResponseEntity.status(HttpStatus.OK)
                .body(new File(FileUtil.folderPath).list());
    }

}
