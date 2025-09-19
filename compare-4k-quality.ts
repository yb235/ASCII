import { ASCIIConverter } from './ascii-converter';
import { ASCII4KConverter } from './ascii-4k-converter';
import * as fs from 'fs';

async function compare4KQuality() {
  const imagePath = './WIN_20250919_19_52_29_Pro.jpg';
  
  console.log('🚀 4K ASCII Quality Comparison Demo');
  console.log('='.repeat(80));
  
  // Original converter
  console.log('\n📸 Original ASCII Converter (120 chars wide):');
  console.log('-'.repeat(60));
  const originalConverter = new ASCIIConverter();
  const startOriginal = Date.now();
  const originalArt = await originalConverter.convertImageToAscii(imagePath, { width: 120 });
  const originalTime = Date.now() - startOriginal;
  
  console.log(originalArt.split('\n').slice(0, 15).join('\n'));
  console.log(`\n📊 Original Stats: ${originalTime}ms, ${originalArt.length} chars`);
  
  // 4K converter - multiple resolutions
  console.log('\n🚀 4K ASCII Converter:');
  console.log('-'.repeat(60));
  
  const converter4K = new ASCII4KConverter();
  
  // Test 4K Ultra (2000 chars)
  console.log('\n🔥 4K Ultra Resolution (2000 chars wide):');
  const start4K = Date.now();
  const result4K = await converter4K.convert4KImageToAscii(imagePath, { 
    width: 2000, 
    terminalWidth: 100,
    useEdgeDetection: true,
    useAntiAliasing: true 
  });
  const time4K = Date.now() - start4K;
  
  console.log(result4K.ascii.split('\n').slice(0, 15).join('\n'));
  console.log(`📊 4K Ultra Stats: ${time4K}ms, ${result4K.stats.characterCount} chars, ${result4K.stats.memoryUsage}MB`);
  
  // Test High Definition (800 chars)
  console.log('\n📺 HD Resolution (800 chars wide):');
  const startHD = Date.now();
  const resultHD = await converter4K.convert4KImageToAscii(imagePath, { 
    width: 800, 
    terminalWidth: 120,
    useEdgeDetection: true,
    useAntiAliasing: true 
  });
  const timeHD = Date.now() - startHD;
  
  console.log(resultHD.ascii.split('\n').slice(0, 15).join('\n'));
  console.log(`📊 HD Stats: ${timeHD}ms, ${resultHD.stats.characterCount} chars, ${resultHD.stats.memoryUsage}MB`);
  
  // Comparison Summary
  console.log('\n📈 QUALITY IMPROVEMENT SUMMARY');
  console.log('='.repeat(80));
  
  const improvements = {
    resolution: {
      original: 120,
      hd: 800,
      ultra4k: 2000
    },
    detail: {
      original: 'Basic character mapping',
      improved: 'Edge detection + Anti-aliasing + Advanced brightness'
    },
    characters: {
      original: originalArt.length,
      hd: resultHD.stats.characterCount,
      ultra4k: result4K.stats.characterCount
    },
    performance: {
      original: `${originalTime}ms`,
      hd: `${timeHD}ms`,
      ultra4k: `${time4K}ms`
    }
  };
  
  console.log(`🎯 Resolution Increase:`);
  console.log(`   Original: ${improvements.resolution.original} chars wide`);
  console.log(`   HD:       ${improvements.resolution.hd} chars wide (${(improvements.resolution.hd/improvements.resolution.original).toFixed(1)}x larger)`);
  console.log(`   4K Ultra: ${improvements.resolution.ultra4k} chars wide (${(improvements.resolution.ultra4k/improvements.resolution.original).toFixed(1)}x larger)`);
  
  console.log(`\n📊 Character Count:`);
  console.log(`   Original: ${improvements.characters.original.toLocaleString()} chars`);
  console.log(`   HD:       ${improvements.characters.hd.toLocaleString()} chars (${(improvements.characters.hd/improvements.characters.original).toFixed(1)}x more)`);
  console.log(`   4K Ultra: ${improvements.characters.ultra4k.toLocaleString()} chars (${(improvements.characters.ultra4k/improvements.characters.original).toFixed(1)}x more)`);
  
  console.log(`\n⚡ Performance:`);
  console.log(`   Original: ${improvements.performance.original}`);
  console.log(`   HD:       ${improvements.performance.hd}`);
  console.log(`   4K Ultra: ${improvements.performance.ultra4k}`);
  
  console.log(`\n🎨 Quality Features:`);
  console.log(`   Original: ${improvements.detail.original}`);
  console.log(`   4K:       ${improvements.detail.improved}`);
  
  console.log('\n✨ KEY IMPROVEMENTS:');
  console.log('   ✅ Up to 16.7x higher resolution (2000 vs 120 chars wide)');
  console.log('   ✅ Edge detection for sharper details');
  console.log('   ✅ Anti-aliasing for smoother gradients');
  console.log('   ✅ Advanced brightness mapping with gamma correction');
  console.log('   ✅ Ultra-dense character sets for maximum detail');
  console.log('   ✅ Multi-resolution output support');
  console.log('   ✅ Performance optimization for large images');
  console.log('   ✅ File output support for sharing large ASCII art');
  
  // Save comparison to file
  const comparisonReport = `
4K ASCII Art Quality Comparison Report
=====================================

Resolution Comparison:
- Original: ${improvements.resolution.original} chars wide
- HD: ${improvements.resolution.hd} chars wide (${(improvements.resolution.hd/improvements.resolution.original).toFixed(1)}x larger)
- 4K Ultra: ${improvements.resolution.ultra4k} chars wide (${(improvements.resolution.ultra4k/improvements.resolution.original).toFixed(1)}x larger)

Character Count:
- Original: ${improvements.characters.original.toLocaleString()} chars
- HD: ${improvements.characters.hd.toLocaleString()} chars (${(improvements.characters.hd/improvements.characters.original).toFixed(1)}x more)
- 4K Ultra: ${improvements.characters.ultra4k.toLocaleString()} chars (${(improvements.characters.ultra4k/improvements.characters.original).toFixed(1)}x more)

Performance:
- Original: ${improvements.performance.original}
- HD: ${improvements.performance.hd}
- 4K Ultra: ${improvements.performance.ultra4k}

Quality Improvements:
✅ Up to 16.7x higher resolution
✅ Edge detection for sharper details
✅ Anti-aliasing for smoother gradients
✅ Advanced brightness mapping
✅ Ultra-dense character sets
✅ Multi-resolution output support
✅ Performance optimization
✅ File output support

The 4K ASCII converter represents a massive quality improvement over the original,
delivering cinema-quality ASCII art with unprecedented detail and clarity.
`;

  await fs.promises.writeFile('./4k_comparison_report.txt', comparisonReport, 'utf8');
  console.log('\n💾 Detailed comparison report saved to: ./4k_comparison_report.txt');
}

// Export and run if called directly
export { compare4KQuality };

if (require.main === module) {
  compare4KQuality().catch(console.error);
}