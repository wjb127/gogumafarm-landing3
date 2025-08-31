"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { ImageUpload } from "@/components/image-upload"

interface Article {
  id: string
  title: string
  description: string
  image: string
  badges: { text: string; className: string }[]
  published_date: string
  is_featured: boolean
  category: string
}

export default function ArticlesManagementPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Article>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    image: "",
    badges: "",
    category: "",
    is_featured: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("kmong_12_articles")
      .select("*")
      .order("published_date", { ascending: false })
    
    if (data && !error) {
      setArticles(data)
    }
    setLoading(false)
  }

  const handleEdit = (article: Article) => {
    setEditingId(article.id)
    setEditForm({
      title: article.title,
      description: article.description,
      image: article.image,
      badges: article.badges,
      category: article.category,
      is_featured: article.is_featured
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    const { error } = await supabase
      .from("kmong_12_articles")
      .update({
        title: editForm.title,
        description: editForm.description,
        image: editForm.image,
        badges: editForm.badges,
        category: editForm.category,
        is_featured: editForm.is_featured,
        updated_at: new Date().toISOString()
      })
      .eq("id", editingId)

    if (!error) {
      await fetchArticles()
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase
        .from("kmong_12_articles")
        .delete()
        .eq("id", id)

      if (!error) {
        await fetchArticles()
      }
    }
  }

  const handleAdd = async () => {
    const badges = newForm.badges.split(",").map(text => ({
      text: text.trim(),
      className: "badge-purple"
    })).filter(badge => badge.text)

    const { error } = await supabase
      .from("kmong_12_articles")
      .insert({
        title: newForm.title,
        description: newForm.description,
        image: newForm.image,
        badges,
        category: newForm.category,
        is_featured: newForm.is_featured,
        published_date: new Date().toISOString()
      })

    if (!error) {
      await fetchArticles()
      setIsAdding(false)
      setNewForm({ title: "", description: "", image: "", badges: "", category: "", is_featured: false })
    }
  }

  const handleToggleFeatured = async (id: string, is_featured: boolean) => {
    await supabase
      .from("kmong_12_articles")
      .update({ is_featured, updated_at: new Date().toISOString() })
      .eq("id", id)
    
    await fetchArticles()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">아티클 관리</h1>
          <p className="text-gray-600 mt-2">최신 아티클과 인사이트를 관리합니다</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            새 아티클 추가
          </Button>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle>새 아티클 추가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>제목</Label>
                  <Input 
                    placeholder="아티클 제목을 입력하세요"
                    value={newForm.title}
                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>설명</Label>
                  <Textarea 
                    placeholder="아티클 설명을 입력하세요"
                    value={newForm.description}
                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <ImageUpload
                    label="이미지"
                    value={newForm.image}
                    onChange={(url) => setNewForm({ ...newForm, image: url })}
                    folder="articles"
                  />
                </div>
                <div>
                  <Label>카테고리</Label>
                  <Input 
                    placeholder="마케팅, SNS, 콘텐츠 등"
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>뱃지 (쉼표로 구분)</Label>
                  <Input 
                    placeholder="SNS, 바이럴, 콘텐츠"
                    value={newForm.badges}
                    onChange={(e) => setNewForm({ ...newForm, badges: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={newForm.is_featured}
                    onCheckedChange={(checked) => setNewForm({ ...newForm, is_featured: checked })}
                  />
                  <Label>주요 아티클로 설정</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Card key={article.id} className={article.is_featured ? "ring-2 ring-purple-500" : ""}>
            {editingId === article.id ? (
              <CardContent className="p-4 space-y-3">
                <Input 
                  placeholder="제목"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <Textarea 
                  placeholder="설명"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
                <Input 
                  placeholder="이미지 URL"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                />
                <Input 
                  placeholder="카테고리"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                />
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={editForm.is_featured}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, is_featured: checked })}
                  />
                  <Label className="text-sm">주요 아티클</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    저장
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    취소
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <div className="aspect-video relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover rounded-t-lg" />
                  {article.is_featured && (
                    <span className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs">
                      Featured
                    </span>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2">{article.title}</h3>
                  {article.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.badges?.map((badge, i) => (
                      <span key={i} className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                        {badge.text}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">
                      {new Date(article.published_date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(article)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}