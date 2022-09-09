# action-use-template

> 在使用`use template repository`时候，替换模版仓库里面的变量

### 配置参数

|字段| 默认值    | 描述                       |
|---|--------|--------------------------|
|path| \*\*/* | 作用文件或目录                  |
|excludes| -      | 忽略文件或目录(,分隔)，默认不处理              |
|overflow_readme_file| -      | 覆盖 README.md 的文件路径，默认不处理 |
|env_file| -      | 替换的变量文件路径(JSON格式) |
|env| -      | 替换的变量列表: key=value,key2=value2 |
|left_delim| <<[    | 变量左匹配符 |
|right_delim| ]>>    | 变量右匹配符 |

### 使用

**env config**

my_props=hocgin

**file content**

username is <<[ my_props ]>>

**file content result**

username is hocgin

### 替换内置的变量

| 链接   | 用途                         |
|------|----------------------------|
| repository_name | action-use-template        |
| repository_full_name | hocgin/action-use-template |
| repository_html_url | www.hocgin.top             |
| git_ref | git:sha-8                  |
