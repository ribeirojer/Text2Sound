export function isValidKey(key: string): boolean {
    // only allow s3 safe characters and characters which require special handling for now
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
    return /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key)
  }