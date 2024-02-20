import path from 'path';
import moduleAlias from 'module-alias';

const currentDir = path.resolve(
  process.env.NODE_ENV === 'production' ? 'dist' : 'src'
);

moduleAlias.addAliases({
  '@': path.join(currentDir, '.'),
});
