package cz.osu.teacherpractice.service.fileManagement;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.stream.Stream;

import static com.sun.tools.attach.VirtualMachine.list;

public final class FileUtil {

    private FileUtil() {
        // restrict instantiation
    }

    public static final String folderPath =  "/home/student/project/myproject/backend/user-files/";
    public static final String reportsFolderPath =  "/home/student/project/myproject/backend/report-files/";
    public static final Path filePath = Paths.get(folderPath);

    public static long getNumberOfFilesInFolder(long id){
        try (Stream<Path> files = Files.list(Paths.get(folderPath + id))) {
            return files.count();
        }
        catch (Exception e){
            return 999;
        }
    }

    public static long getNumberOfReportsInFolder(long id){
        try (Stream<Path> files = Files.list(Paths.get(reportsFolderPath + id))) {
            return files.count();
        }
        catch (Exception e){
            return 999;
        }
    }

}