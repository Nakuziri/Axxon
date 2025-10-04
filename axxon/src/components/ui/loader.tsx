import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <div className="h-screen flex items-center justify-center">
      <motion.div 
        className="space-y-8 w-full max-w-4xl px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Board title skeleton */}
        <motion.div 
          className="h-8 bg-gray-200 rounded-md w-1/3"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Category columns skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              className="h-64 bg-gray-100 rounded-lg p-4 space-y-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div 
                className="h-6 bg-gray-200 rounded w-2/3"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
              {[1, 2, 3].map((j) => (
                <motion.div 
                  key={j}
                  className="h-12 bg-gray-200 rounded"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.1 }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}