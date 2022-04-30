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

    public static final String folderPath =  "user-files//";
    public static final Path filePath = Paths.get(folderPath);

    public static long getNumberOfFilesInFolder(long id){
        try (Stream<Path> files = Files.list(Paths.get(folderPath + id))) {
            return files.count();
        }
        catch (Exception e){
            return 999;
        }
    }

}